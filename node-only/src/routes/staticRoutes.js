// Static routes
import express from "express";
const router = express.Router();

// Default options
const staticOptions = {
  maxAge: "2y",
  etag: false,
};

// Route for CSS/JS files
router.use("/public", express.static("build/public", staticOptions));
// Route for images
router.use(
  "/public/images",
  express.static("src/public/images", staticOptions)
);
// Route for Lightbox2
router.use(
  "/libs/lightbox2",
  express.static("node_modules/lightbox2/dist", staticOptions)
);
// Route for jQuery
router.use(
  "/libs/jquery/jquery.min.js",
  express.static("node_modules/jquery/dist/jquery.min.js", staticOptions)
);
// Route for favicon.ico
router.use(
  "/favicon.ico",
  express.static("src/public/images/favicon.ico", staticOptions)
);
router.use(
  "/robots.txt",
  express.static("src/public/robots.txt", staticOptions)
);

export default router;
