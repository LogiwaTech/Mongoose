import express, { Router } from "express";
import { savePublisher, listPublisher } from "../controllers/publisher";
const router: Router = express.Router();

router.post("/", savePublisher);
router.get("/", listPublisher);

export default router;
