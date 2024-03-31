// User routes
const express = require("express");
const router = express.Router();

const contactControllers = require("../controllers/contactControllers");
//const { verifyToken } = require("../middleware/auth");
//console.log(verifyToken);
//router.get("/api/contacts", verifyToken, contactControllers.listContacts);
router.get("/api/contacts", contactControllers.listContacts);

router.get(
  "/contacts/view/:contactID",
  verifyToken,
  contactControllers.getContact
);

module.exports = router;
