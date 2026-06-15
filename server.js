require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());

app.get("/search", async (req, res) => {
  try {
    const response = await axios.get("https://api.pexels.com/v1/search", {
      params: {
        query: req.query.query,
        per_page: req.query.per_page || 80,
      },
      headers: {
        Authorization: process.env.PEXELS_API_KEY,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch images",
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
