require("dotenv").config();
const mongoose = require("mongoose");

const cryptoDataSchema = new mongoose.Schema({
  coinId: { type: String, required: true },
  price: { type: Number, required: true },
  marketCap: { type: Number, required: true },
  change24h: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

cryptoDataSchema.index({timestamp: -1 }, { unique: true });
// Update the connection string with your MongoDB Atlas connection string
const uri = process.env.MONGO_DB_ATLAS_URI;
mongoose
  .connect(uri, { dbName: "CoinGeckoData", maxPoolSize: 10 })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB Atlas:", error);
  });

module.exports = mongoose.model("CryptoData", cryptoDataSchema, "cryptoData");
