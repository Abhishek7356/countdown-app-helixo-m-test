import express from "express";
import { getActiveCountdown } from "../controllers/public.js";

const router = express.Router();

router.get("/active/:shop", getActiveCountdown);

export default router;
