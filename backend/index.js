const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware

const app = express();

const fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS for all routes
const corsConfig = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credential: true,
}

app.use(cors(corsConfig));

app.options("", cors(corsConfig))

const routes = require('./routes/routes.js')(app, fs);

const server = app.listen(3001, () => {
  console.log('listening on port %s...', server.address().port);
});
