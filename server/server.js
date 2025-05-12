const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

// middleware
app.use(cors());
app.use(express.json);

// ROUTES //

// CREATE PROFILE

// LOG INTO PROFILE

// GET ITINERARIES FOR EXPLORE PAGE

// LOG ITINERARY TO USER'S ACCOUNT

app.listen(5000, () => console.log('Server on localhost 5000'));