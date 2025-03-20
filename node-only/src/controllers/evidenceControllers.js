/**
 * EvidenceItem controller
 *
 * @module controllers/evidenceControllers
 * @author Jesse Kaufman <jesse@jessekaufman.com>
 */
import EvidenceItemModel, {
  getEvidenceItems,
} from '../models/evidenceItemModel.js'
import {
  formatDuration,
  formatTranscript,
  linkify,
} from '../services/formattingService.js'
import config from '../config/config.js'
import { getDates } from '../models/searchModel.js'
import { getQuery } from '../services/queryService.js'
import { getStats } from '../models/statsModel.js'
import { mongoose } from 'mongoose'
import pug from 'pug'
import versionStrings from '../../build/versions.js'

/**
 * Redirects to canonical evidence item page
 */
const redirect = async (req, res) => {
  const item = await EvidenceItemModel.findById(req.params.id)
  res.redirect(301, `/${item.type}/evidence-item/${item.id}`)
}

/**
 * Renders the HTML for the search form and returns it as a string
 * @param {*} get
 * @param {*} dates
 * @returns
 */
const renderSearchForm = (get, dates) => {
  const searchForm = pug.compileFile('src/views/header/_search.pug')({
    get,
    dates,
  })
  return searchForm
}

/**
 * Renders evidence item list to string
 * @param {*} evidenceItems
 * @param {*} isSingle
 * @returns
 */
const renderEvidenceItemList = (evidenceItems, isSingle, get) => {
  const evidenceItemList = pug.compileFile('src/views/_evidenceList.pug')({
    evidenceItems: evidenceItems,
    isSingle: isSingle,
    cdnUrl: process.env.CDN,
    baseUrl: config.baseUrl,
    get: get,
    formatVideoTranscript: formatTranscript,
    formatDuration: formatDuration,
    linkify: linkify,
  })
  return evidenceItemList
}

/**
 *
 * Lists evidence items
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 */
const render = async (req, res) => {
  let types
  // Setup types array for filtering
  if (
    req.query?.include != null ||
    (Array.isArray(req.query.include) && req.query?.include[0] != null)
  ) {
    types = req.query.include
  }

  if (req.params.type) {
    types = [req.params.type]
  }

  // Build the query from the request object
  const query = await getQuery(mongoose, req)

  // Get stats for the query to display on frontend
  const stats = await getStats(types, query)

  // Get dates for dropdown items
  const dates = await getDates(types)

  // View is single item view
  const isSingle = 'id' in req.params

  if (req.params.type != null) {
    query.type = req.params.type
  }

  // Get matching evidence items
  const evidenceItems = await getEvidenceItems(query, req.query.date_sent_date)

  if (evidenceItems.length === 0) {
    res.status(404).end()
  }

  const get = {
    include: req.query.include,
    victim: req.query.victim,
    number: req.query.number,
    date_sent_date: req.query.date_sent_date,
    type: req.params.type,
    query: req.query.query,
  }

  // Render the evidence item list to a string
  const evidenceItemList = renderEvidenceItemList(evidenceItems, isSingle, get)

  // Render the search form to a string
  const searchForm = await renderSearchForm(get, dates)

  // Render the index page using pugjs
  await res.render('index', {
    item: isSingle ? evidenceItems[0] : null,
    evidenceItemList: evidenceItemList,
    searchForm: searchForm,
    stats: stats,
    isSingle: isSingle,
    pageClass: isSingle === true ? 'single' : 'list',
    versionStrings: versionStrings,
    dates: dates,
    cdnUrl: process.env.CDN,
    get: get,
    baseUrl: config.baseUrl,
    formatDuration: formatDuration,
  })
}

export default { render, redirect }
