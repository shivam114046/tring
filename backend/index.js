const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 8080;
const path = require("path");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const { connection } = require("./connector");
const cors = require("cors");
app.use(cors());
const { bookMovieSchema } = require("./schema");

app.listen(port, () => console.log(`App listening on port ${port}!`));

app.get("/api/booking", async (req, res) => {
  try {
    const bookedMovies = await connection.find().exec();
    console.log("Retrieved data:", bookedMovies);
    res.status(200).send(bookedMovies);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
});

app.post("/api/booking", async (req, res) => {
  const { seats, slot, movie } = req.body;

  try {
    if (!movie) {
      return res.status(422).send("Please select a movie");
    }
    if (!slot) {
      return res.status(422).send("Please select the slot");
    }
    if (seats.A1 || seats.A2 || seats.A3 || seats.A4 || seats.D1 || seats.D2) {
      const savedData = await connection(req.body).save();
      res.status(200).send(savedData);
    } else {
      return res.status(422).send("Please select a seat");
    }
  } catch (error) {
    console.error("Error occurred while saving data:", error);
    res.status(500).send("An error occurred while saving data");
  }
});

module.exports = app;
