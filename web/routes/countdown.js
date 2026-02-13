import express from "express";
import {
    createCountdown,
    getCountdowns,
    updateCountdown,
    deleteCountdown
} from "../controllers/countdown.js";

const router = express.Router();

router.post("/create", createCountdown);
router.get("/list", getCountdowns);
router.put("/:id", updateCountdown);   
router.delete("/delete/:id", deleteCountdown);

export default router;
