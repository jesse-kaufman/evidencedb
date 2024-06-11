/**
 * EvidenceItem controller
 *
 * @module controllers/evidenceControllers
 * @author Jesse Kaufman <jesse@jessekaufman.com>
 */

import { getEvidenceItems } from "../models/evidenceItemModel.js";
import { getQuery } from "../utils/queryUtils.js";
import { getStats } from "../models/statsModel.js";
import { getDates } from "../models/searchModel.js";
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
  // Build the query from the request object
  let query = await getQuery(req);

  // Get stats for the query to display on frontend
  let stats = await getStats(req.query.include, query);

  // Get dates for dropdown items
  let dates = await getDates(req.query.include);

  // Get matching evidence items for the query
  let evidenceItems = await getEvidenceItems(query, req.query.date_sent_date);

  // Render the index page using pugjs
  await res.render("index", {
    evidenceItems: evidenceItems,
    stats: stats,
    isSingle: req.params.id ? true : false,
    get: {
      include: req.query.include,
      victim: req.query.victim,
      number: req.query.number,
      date_sent_date: req.query.date_sent_date,
      type: req.query.type,
      query: req.query.query,
    },
    dates: dates,
    cdn_url: process.env.CDN,
    formatPhone: formatPhone,
    formatVideoTranscript: formatVideoTranscript,
    formatDuration: formatDuration,
  });
}
