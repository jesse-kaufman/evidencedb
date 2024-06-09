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

/**
 * Gets evidence items from database
 * @param {*} query
 * @param {*} dateSentDate
 * @returns
 */
export const getEvidenceItems = async (query, dateSentDate = "") => {
  // Sort by date
  const sort = { date_sent: 1 };

  // Filter based on date (or not)
  const dateFilter = dateSentDate ? { dateSentDate: dateSentDate } : {};

  // Evidence item properties to select from database
  const project = {
    type: 1,
    date_sent: 1,
    from: 1,
    to: 1,
    direction: 1,
    victim: 1,
    body: 1,
    body_html: 1,
    subject: 1,
    duration: 1,
    filename: 1,
    attachments: 1,
    screenshots: 1,
    title: 1,
    formattedDate: {
      $dateToString: {
        format: "%b %d, %Y",
        date: "$date_sent",
        timezone: "America/Chicago",
      },
    },
    dateSentDate: {
      $dateToString: {
        format: "%Y-%m-%d",
        date: "$date_sent",
        timezone: "America/Chicago",
      },
    },
  };

  // Return matching evidence items for the query
  return await EvidenceItemModel.aggregate([{ $match: query }])
    .sort(sort)
    .project(project)
    .match(dateFilter);
};

export default EvidenceItemModel;
