// Contacts controller
const Contacts = require("../models/contactModel");

// List all contacts
exports.listContacts = async (req, res) => {
  try {
    var query = {};

    if (req.query.include) {
      query.type = { $in: req.query.include };
    }

    const result = await Contacts.find(query).sort({ date_sent: 1 });

    res.json(result);
  } catch (err) {
    console.log(err);
  }
};

// View a particular contact
exports.getContact = async (req, res) => {
  try {
    const result = await Contacts.find({ _id: req.params.contactID }).sort({
      date_sent: 1,
    });
    console.log("sending contact " + req.params.contactID);
    res.json(result);
  } catch (err) {
    console.log(err);
  }
};
