/**
 * EvidenceItem controller
 *
 * @module controllers/evidenceControllers
 * @author Jesse Kaufman <jesse@jessekaufman.com>
 */

import EvidenceItem from "../models/evidenceItemModel.js";
import { getQuery } from "../utils/queryUtils.js";
import { getStats, getDates, getNumbers } from "../utils/evidenceUtils.js";
import {
  formatPhone,
  formatVideoTranscript,
  formatDuration,
} from "../utils/helpers.js";

/**
 *
 * Lists evidence items
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 */
export async function printEvidence(req, res) {
  let numbers = null;

  // Build the query from the request object
  let query = getQuery(req);

  // Get stats for the query to display on frontend
  let stats = await getStats(req.query.include, query);

  // Get matching evidence items for the query
  let evidenceItems = await EvidenceItem.aggregate([{ $match: query }])
    .sort({
      date_sent: 1,
    })
    .project({
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
      title: 1,
      formattedDate: {
        $dateToString: { format: "%b %d, %Y", date: "$date_sent" },
      },
    });
  let dates = await getDates(req.query.include);

  // Only get phone number list if req.query.include is unset
  if (!req.query.include) {
    numbers = await getNumbers();
  }

  // Render the index page using pugjs
  await res.render("index", {
    evidenceItems: evidenceItems,
    stats: stats,
    get: req.query,
    dates: dates,
    numbers: numbers,
    cdn_url: process.env.CDN,
    formatPhone: formatPhone,
    formatVideoTranscript: formatVideoTranscript,
    formatDuration: formatDuration,
  });
}
