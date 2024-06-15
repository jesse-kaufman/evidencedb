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
  duration: String,
  durationSeconds: Number,
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
export const getEvidenceItems = async (baseQuery, dateSentDate = "") => {
  let query = Object.assign({}, baseQuery);
  delete query.date_sent_date;

  // Sort by date
  const sort = { date_sent: 1 };

  // Filter based on date (or not)
  const dateFilter = dateSentDate ? { dateSentDate: dateSentDate } : {};

  const addFromFields = {
    fromAddress: {
      $switch: {
        branches: [
          {
            case: { $in: ["$type", ["email", "social"]] },
            then: {
              $regexFind: {
                input: "$from",
                regex: /<([^>]+)>/,
                options: "i",
              },
            },
          },
          {
            case: { $eq: ["$type", "video"] },
            then: "YouTube",
          },
          {
            case: { $in: ["$type", ["text", "voicemail"]] },
            then: {
              $concat: [
                { $substr: ["$from", 0, 3] },
                "-",
                { $substr: ["$from", 3, 3] },
                "-",
                { $substr: ["$from", 6, 4] },
              ],
            },
          },
        ],
      },
    },
    fromName: {
      $switch: {
        branches: [
          {
            case: { $in: ["$type", ["email", "social"]] },
            then: {
              $regexFind: {
                input: "$from",
                regex: /(.*)<[^>]+>/,
                options: "i",
              },
            },
          },
        ],
        default: process.env.OFFENDER_NAME,
      },
    },
  };

  const addDateFields = {
    dateSentDate: {
      $dateToString: {
        format: "%Y-%m-%d",
        date: "$date_sent",
        timezone: "America/Chicago",
      },
    },
    formattedDate: {
      $dateToString: {
        format: "%b %d, %Y",
        date: "$date_sent",
        timezone: "America/Chicago",
      },
    },
  };

  const setFromFields = {
    $set: {
      fromAddress: {
        $cond: {
          if: { $in: ["$type", ["email", "social"]] },
          then: { $arrayElemAt: ["$fromAddress.captures", 0] },
          else: "$fromAddress",
        },
      },
      fromName: {
        $cond: {
          if: { $in: ["$type", ["email", "social"]] },
          then: {
            $rtrim: {
              input: { $arrayElemAt: ["$fromName.captures", 0] },
              chars: " ",
            },
          },
          else: "$fromName",
        },
      },
    },
  };

  // Return matching evidence items for the query
  return await EvidenceItemModel.aggregate([{ $match: query }])
    // Add formatted date fields to documents
    .addFields(addDateFields)
    // Filter results by date if applicable
    .match(dateFilter)
    // Set email from fields if applicable
    .addFields(addFromFields)
    .append(setFromFields)
    // Sort the results by date
    .sort(sort);
};

export default EvidenceItemModel;
