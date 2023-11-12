import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export class connectToMongo {
  constructor() {
    this._connect();
  }

  async _connect() {
    try {
      await mongoose.connect(process.env.mongoURL || "");
      console.log("mongoose connected successfully");
    } catch (error) {
      console.log("Someting went wrong!", error);
    }
  }
}

module.exports = new connectToMongo();
