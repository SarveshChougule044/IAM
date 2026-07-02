// backend/models/AccessRequest.js
const mongoose = require("mongoose");

const accessRequestSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    type: { type: String, required: true }, // e.g. "Temporary admin", "VPN access"
    details: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "denied"],
      default: "pending",
    },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    decidedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    decidedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AccessRequest", accessRequestSchema);