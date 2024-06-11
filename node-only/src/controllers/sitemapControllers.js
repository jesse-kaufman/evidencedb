import { getEvidenceItems } from "../models/evidenceItemModel.js";
export const printSitemap = async (req, res) => {
  // Get matching evidence items for the query
  let evidenceItems = await getEvidenceItems({});

  await res.render("sitemap_xml", { evidenceItems: evidenceItems });
};
