import express from "express";
import {
    createCountdown,
    getCountdowns,
    updateCountdown,
    deleteCountdown
} from "../controllers/countdown.js";
import { validate } from "../middlewares/validate.js";
import { createCountdownSchema, updateCountdownSchema } from "../validations/countdown.js";

const router = express.Router();

router.post("/create", validate(createCountdownSchema), createCountdown);
router.get("/list", getCountdowns);
router.put("/update/:id", validate(updateCountdownSchema), updateCountdown);
router.delete("/delete/:id", deleteCountdown);

export default router;
