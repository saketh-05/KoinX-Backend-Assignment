var express = require("express");
var router = express.Router();
var axios = require("axios");
var CryptoData = require("../models/CryptoData");
require("dotenv").config();

const fetchData = async () => {
  try {
    //console.log("Fetching data from the API");
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
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
      }
    );
    //console.log("Data fetched from the API successfully - ", response.data);
    const istoffset = 5.5 * 60;
    const data = Object.keys(response.data).map((coinId) => {
      const coin = response.data[coinId];
      const date = new Date();
      return {
        coinId,
        price: coin.usd,
        marketCap: coin.usd_market_cap,
        change24h: coin.usd_24h_change,
        timestamp: new Date(date.getTime() + istoffset * 60000),
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
  if (!coin) {
    return res.status(400).json({ error: "Coin parameter is required" });
  } else if (
    coin !== "bitcoin" &&
    coin !== "ethereum" &&
    coin !== "matic-network"
  ) {
    return res
      .status(400)
      .json({
        error:
          "Invalid coin parameter, Permitted coins = bitcoin, ethereum and matic-network",
      });
  }
  try {
    const data = await CryptoData.find({ coinId: coin }).sort({timestamp: -1}).limit(1).lean();

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
  if (!coin) {
    return res.status(400).json({ error: "Coin parameter is required" });
  } else if (
    coin !== "bitcoin" &&
    coin !== "ethereum" &&
    coin !== "matic-network"
  ) {
    return res.status(400).json({
      error:
        "Invalid coin parameter, Permitted coins = bitcoin, ethereum and matic-network",
    });
  }
  try {
    const records = await CryptoData.aggregate([
      { $match: { coinId: coin } },
      { $sort: { timestamp: -1 } },
      { $limit: 100 },
      {
        $group: {
          _id: null,
          prices: { $push: "$price" },
          mean: { $avg: "$price" },
        },
      },
      {
        $project: {
          _id: 0,
          prices: 1,
          mean: 1,
          variance: {
            $reduce: {
              input: "$prices",
              initialValue: 0,
              in: {
                $add: [
                  "$$value",
                  { $pow: [{ $subtract: ["$$this", "$mean"] }, 2] },
                ],
              },
            },
          },
        },
      },
      {
        $addFields: {
          deviation: { $sqrt: { $divide: ["$variance", 100] } },
        },
      },
    ]);
  
    if (records.length === 0) {
      return res.status(404).json({ error: "No data found for the requested coin" });
    }
  
    const deviation = records[0].deviation.toFixed(5);
    res.json({ deviation });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = { router, fetchData };
