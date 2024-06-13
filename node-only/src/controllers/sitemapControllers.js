import { getEvidenceItems } from "../models/evidenceItemModel.js";
export const printSitemap = async (req, res) => {
  // Get matching evidence items for the query
  let evidenceItems = await getEvidenceItems({});

  await res.type("xml").render("sitemap_xml", { evidenceItems: evidenceItems });
};
