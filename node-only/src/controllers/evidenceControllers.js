/**
 * EvidenceItem controller
 *
 * @module controllers/evidenceControllers
 * @author Jesse Kaufman <jesse@jessekaufman.com>
 */

import versionStrings from "../../build/versions.js";
import { getEvidenceItems } from "../models/evidenceItemModel.js";
import { getQuery } from "../services/queryService.js";
import { getStats } from "../models/statsModel.js";
import { getDates } from "../models/searchModel.js";
import {
  formatTranscript,
  formatDuration,
} from "../services/formattingService.js";
import { mongoose } from "mongoose";
import pug from "pug";

/**
 * Renders the HTML for the search form and returns it as a string
 * @param {*} get
 * @param {*} dates
 * @returns
 */
const renderSearchForm = async (get, dates) => {
  const searchForm = pug.compileFile("src/views/header/_search.pug")({
    get,
    dates,
  });
  return searchForm;
};

/**
 * Renders evidence item list to string
 * @param {*} evidenceItems
 * @param {*} isSingle
 * @returns
 */
const renderEvidenceItemList = async (evidenceItems, isSingle) => {
  const evidenceItemList = pug.compileFile("src/views/_evidenceList.pug")({
    evidenceItems: evidenceItems,
    isSingle: isSingle,
    cdn_url: process.env.CDN,
    formatVideoTranscript: formatTranscript,
    formatDuration: formatDuration,
  });
  return evidenceItemList;
};

/**
 *
 * Lists evidence items
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 */
const render = async (req, res) => {
  // Build the query from the request object
  let query = await getQuery(mongoose, req);

  // Get stats for the query to display on frontend
  let stats = await getStats(req.query.include, query);

  // Get dates for dropdown items
  let dates = await getDates(req.query.include);

  // View is single item view
  const isSingle = "id" in req.params;

  // Get matching evidence items
  let evidenceItems = await getEvidenceItems(query, req.query.date_sent_date);

  // Render the evidence item list to a string
  const evidenceItemList = await renderEvidenceItemList(
    evidenceItems,
    isSingle
  );

  const get = {
    include: req.query.include,
    victim: req.query.victim,
    number: req.query.number,
    date_sent_date: req.query.date_sent_date,
    type: req.query.type,
    query: req.query.query,
  };

  // Render the search form to a string
  const searchForm = await renderSearchForm(get, dates);

  // Render the index page using pugjs
  await res.render("index", {
    item: isSingle ? evidenceItems[0] : null,
    evidenceItemList: evidenceItemList,
    searchForm: searchForm,
    stats: stats,
    isSingle: isSingle,
    pageClass: isSingle === true ? "single" : "list",
    versionStrings: versionStrings,
    dates: dates,
    cdn_url: process.env.CDN,
  });
};

export default { render };
