// Contact model

import mongoose from "mongoose";
export const validTypes = ["text", "email", "voicemail", "video", "social"];

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
    enum: validTypes,
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
    enum: ["jesse", "shannon", "both"],
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
  screenshots: Array,
});

const EvidenceItemModel = new mongoose.model("Item", EvidenceItemSchema);

export default EvidenceItemModel;
