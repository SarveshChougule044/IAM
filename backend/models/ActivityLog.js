const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    actor: { type: String, required: true },     // e.g. "Priya Sharma" or "System"
    actorId: { type: String },                   // adminId or system id
    action: { type: String, required: true },    // e.g. "Approved request"
    target: { type: String },                    // e.g. "Access for john@example.com"
    ip: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);