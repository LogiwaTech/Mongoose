import express, { Application } from "express";
import { connectToMongo } from "./utils/connect-mongo";

import bookRouter from "./routes/book";
import publisherRouter from "./routes/publisher";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(bodyParser.json());

const db = connectToMongo;

app.use("/api/books", bookRouter);
app.use("/api/publishers", publisherRouter);

app.listen(port, () => {
  console.log(`🚀⭐️ Server ready at: http://localhost:${port}`);
});
