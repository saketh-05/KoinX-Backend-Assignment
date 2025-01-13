var express = require("express");
var router = express.Router();
var axios = require("axios");
var CryptoData = require("../models/CryptoData");
require("dotenv").config();

const fetchData = async () => {
  try {
    //console.log("Fetching data from the API");
    const response = await axios.get("https://api.coingecko.com/api/v3/simple/price",{
      params: {
        ids: "bitcoin,ethereum,matic-network",
        vs_currencies: "usd",
        include_market_cap: "true",
        include_24hr_change: "true",
      },
      headers: {
        "Content-Type": "application/json",
        "x-cg-demo-api-key": process.env.COIN_GECKO_API,
      },
      method: "GET",
    });
    //console.log("Data fetched from the API successfully - ", response.data);
    const istoffset = 5.5 * 60;
    const data = Object.keys(response.data).map((coinId) => {
      const coin = response.data[coinId];
      const date = new Date();
      return {
        coinId,
        price: coin.usd,
        marketCap: coin. usd_market_cap,
        change24h: coin.usd_24h_change,
        timestamp: new Date(date.getTime() + (istoffset) * 60000),
      };
    });
    //console.log("Saving data to the database, data:",data);
    await CryptoData.insertMany(data);
  } catch {
    (error) => {
      console.log(error);
    };
  }
};

router.get("/stats", async (req, res) => {
  const { coin } = req.query;
  try {
    const data = await CryptoData.findOne({ coinId: coin }).sort({
      timestamp: -1,
    });

    if (!data)
      return res
        .status(404)
        .json({ error: "No data found for the requested coin" });

    res.json({
      price: data.price,
      marketCap: data.marketCap,
      "24hChange": data.change24h,
    });
  } catch (e) {
    res.status(500).json({ error: "Server error - " + e });
  }
});

router.get("/deviation", async (req, res) => {
  const { coin } = req.query;

  try {
    const records = await CryptoData.find({ coinId: coin })
      .sort({ timestamp: -1 })
      .limit(100);
    if (records.length === 0)
      return res
        .status(404)
        .json({ error: "No data found for the requested coin" });

    const prices = records.map((record) => record.price);
    const mean = prices.reduce((a, b) => a + b, 0) / prices.length;

    const variance =
      prices.reduce((acc, price) => acc + Math.pow(price - mean, 2), 0) /
      prices.length;
    const deviation = Math.sqrt(variance);

    res.json({ deviation: deviation.toFixed(5) });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = { router, fetchData };
