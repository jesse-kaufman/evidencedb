import { getEvidenceItems } from '../models/evidenceItemModel.js'
import config from '../config/config.js'
const render = async (req, res) => {
  // Get matching evidence items for the query
  const evidenceItems = await getEvidenceItems({})

  await res.type('xml').render('sitemap_xml', {
    evidenceItems: evidenceItems,
    baseUrl: config.baseUrl,
    cdnUrl: process.env.CDN,
  })
}

export default { render }
