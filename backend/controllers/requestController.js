// backend/controllers/requestController.js
const { v4: uuidv4 } = require("uuid");
const { findAll, updateOne, insertOne } = require("../utils/fileStore");

const REQUESTS_FILE = "accessRequests.json";
const LOGS_FILE = "activityLogs.json";

// GET /api/admin/requests
exports.getAllRequests = (req, res) => {
  try {
    const requests = findAll(REQUESTS_FILE)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 100);
    res.json({ success: true, requests });
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).json({ success: false, message: "Failed to load requests." });
  }
};

// PUT /api/admin/requests/:id
exports.updateRequestStatus = (req, res) => {
  const { status } = req.body;

  if (!["approved", "denied"].includes(status)) {
    return res.status(400).json({ success: false, message: "Status must be 'approved' or 'denied'." });
  }

  try {
    const requests = findAll(REQUESTS_FILE);
    const request = requests.find((r) => r.id === req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found." });
    }

    updateOne(
      REQUESTS_FILE,
      (r) => r.id === req.params.id,
      () => ({
        status,
        decidedBy: req.admin?.adminId || "Unknown admin",
        decidedAt: new Date().toISOString(),
      })
    );

    const actionText = status === "approved" ? "Approved request" : "Denied request";
    insertOne(LOGS_FILE, {
      id: uuidv4(),
      actor: req.admin?.adminId || "Unknown admin",
      actorId: req.admin?.adminId || null,
      action: actionText,
      target: `${request.userEmail} – ${request.type}`,
      ip: req.ip || "",
      createdAt: new Date().toISOString(),
    });

    const updated = findAll(REQUESTS_FILE).find((r) => r.id === req.params.id);
    res.json({ success: true, request: updated });
  } catch (err) {
    console.error("Error updating request:", err);
    res.status(500).json({ success: false, message: "Failed to update request." });
  }
};