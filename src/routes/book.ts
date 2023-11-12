import express, { Router } from "express";
import {
  saveBook,
  findBook,
  deleteBook,
  updateBook,
  findAllBook,
} from "../controllers/book";
const router: Router = express.Router();

router.post("/", saveBook);

//router.get("/", findBook);

router.get("/", findAllBook);

router.delete("/:id", deleteBook);

router.put("/:id", updateBook);

export default router;
