// Contact model

const mongoose = require("mongoose");

const AttachmentSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  attachment_id: {
    type: String,
    required: true,
  },
});

const EvidenceItemSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  date_sent: {
    type: Date,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: String,
  direction: String,
  victim: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  body_html: String,
  duration: Number,
  filename: String,
  attachments: [AttachmentSchema],
});

const EvidenceItemModel = new mongoose.model("Item", EvidenceItemSchema);

module.exports = EvidenceItemModel;
