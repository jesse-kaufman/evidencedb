// MongoDB connection
const url = "mongodb://abusedb:eZZRnAQs6eu972n7HIbUYMsgphwFkYaZaL5TgNcYzHzbfIwkpC3d1Pcqtn5FKWM5a@localhost:27017/abusedb";
const mongoose = require('mongoose');
mongoose.connect(url);

// Setup Express
const express = require("express");
const app = express();

// Express Validator
const { check } = require('express-validator');

// Enable compression
const compression = require('compression')
app.use(compression())

// Interpret responses as JSON
app.use(express.json());

// Use CORS
const cors = require('cors');
app.use(cors());

// Models
const Contacts = require('./models/Contacts');

// Static routes
app.use('/public', express.static('public'))

// List all contacts
app.get('/contacts/', async (req, res) => {
    try {
        var query = {}

        if (req.query.include) {
            query.type = { $in: req.query.include }
        }

        const result = await Contacts.find(query).sort({ date_sent: 1 });

        res.json(result);
    }
    catch (err) {
        console.log(err);
    }
});

// View a particular contact
app.get('/contacts/view/:contactID', async (req, res) => {
    try {
        const result = await Contacts.find({ _id: req.params.contactID }).sort({ date_sent: 1 });
        console.log("sending contact " + req.params.contactID);
        res.json(result);
    }
    catch (err) {
        console.log(err);
    }
});

// Start the server
const server = app.listen(8080, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});