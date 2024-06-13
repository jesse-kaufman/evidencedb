import express from "express";
const router = express.Router();

const staticOptions = {
  maxAge: "2y",
  etag: false,
};

// Static routes
router.use("/public", express.static("src/public", staticOptions));
router.use(
  "/libs/lightbox2",
  express.static("node_modules/lightbox2/dist", staticOptions)
);
router.use(
  "/libs/jquery/jquery.min.js",
  express.static("node_modules/jquery/dist/jquery.min.js", staticOptions)
);

export default router;
