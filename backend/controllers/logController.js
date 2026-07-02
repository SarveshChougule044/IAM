// backend/controllers/logController.js
const { findAll } = require("../utils/fileStore");

const LOGS_FILE = "activityLogs.json";

// GET /api/admin/logs
exports.getAdminLogs = (req, res) => {
  try {
    const logs = findAll(LOGS_FILE)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 100);
    res.json({ success: true, logs });
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ success: false, message: "Failed to load logs." });
  }
};