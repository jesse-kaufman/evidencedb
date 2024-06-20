/**
 * EvidenceItem controller
 *
 * @module controllers/evidenceControllers
 * @author Jesse Kaufman <jesse@jessekaufman.com>
 */
import {
  formatDuration,
  formatTranscript,
} from "../services/formattingService.js";
import { getDates } from "../models/searchModel.js";
import { getEvidenceItems } from "../models/evidenceItemModel.js";
import { getQuery } from "../services/queryService.js";
import { getStats } from "../models/statsModel.js";
import { mongoose } from "mongoose";
import EvidenceItemModel from "../models/evidenceItemModel.js";
import pug from "pug";
import versionStrings from "../../build/versions.js";
import { linkify } from "../services/formattingService.js";

/**
 * Redirects to canonical evidence item page
 */
const redirect = async (req, res) => {
  let item = await EvidenceItemModel.findById(req.params.id);
  res.redirect(301, `/${item.type}/evidence-item/${item.id}`);
};

/**
 * Renders the HTML for the search form and returns it as a string
 * @param {*} get
 * @param {*} dates
 * @returns
 */
const renderSearchForm = (get, dates) => {
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
const renderEvidenceItemList = (evidenceItems, isSingle) => {
  const evidenceItemList = pug.compileFile("src/views/_evidenceList.pug")({
    evidenceItems: evidenceItems,
    isSingle: isSingle,
    cdn_url: process.env.CDN,
    formatVideoTranscript: formatTranscript,
    formatDuration: formatDuration,
    linkify: linkify,
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
  const query = await getQuery(mongoose, req);

  // Get stats for the query to display on frontend
  const stats = await getStats(req.query.include, query);

  // Get dates for dropdown items
  const dates = await getDates(req.query.include);

  // View is single item view
  const isSingle = "id" in req.params;

  if (req.params.type != null) {
    query.type = req.params.type;
  }

  // Get matching evidence items
  const evidenceItems = await getEvidenceItems(query, req.query.date_sent_date);

  // Render the evidence item list to a string
  const evidenceItemList = renderEvidenceItemList(evidenceItems, isSingle);

  const get = {
    include: req.query.include,
    victim: req.query.victim,
    number: req.query.number,
    date_sent_date: req.query.date_sent_date,
    type: query.type,
    query: req.query.query,
  };

  // Render the search form to a string
  const searchForm = renderSearchForm(get, dates);

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
    get: get,
  });
};

export default { render, redirect };
