import Countdown from "../models/Countdown.js";
import CountdownService from "../services/countdown.js";

export const createCountdown = async (req, res) => {
    try {
        const session = res.locals.shopify.session;

        if (!session) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const shop = session.shop;

        const countdown = await CountdownService.createCountdown(
            shop,
            req.body
        );

        return res.status(201).json({
            success: true,
            countdown,
        });

    } catch (error) {
        console.error("Create Countdown Error:", error.message);

        return res.status(400).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};

export const getCountdowns = async (req, res) => {
    try {
        const session = res.locals.shopify.session;

        if (!session) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const shop = session.shop;

        const {
            page = 1,
            limit = 10,
            sortBy = "createdAt",
            order = "desc",
            query = "",
            status,
            startFrom,
            startTo
        } = req.query;

        const result = await CountdownService.getCountdowns(shop, {
            page: Number(page),
            limit: Number(limit),
            sortBy,
            order,
            query,
            status,
            startFrom,
            startTo
        });

        return res.json({
            success: true,
            ...result,
        });

    } catch (error) {
        console.error("Get Countdowns Error:", error.message);

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateCountdown = async (req, res) => {
    try {
        const { id } = req.params;

        const updated = await Countdown.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        res.status(200).json({ success: true, item: updated });
    } catch (err) {
        console.error("Update Countdown Error:", err.message);
        res.status(500).json({ success: false, message: "Failed to update countdown" });
    }
};

export const deleteCountdown = async (req, res) => {
    try {
        const { id } = req.params;

        await Countdown.findByIdAndDelete(id);

        res.status(200).json({ success: true });
    } catch (err) {
        console.error("Delete Countdown Error:", err.message);
        res.status(500).json({ success: false, message: "Failed to delete countdown" });
    }
};