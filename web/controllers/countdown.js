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
        } = req.query;

        const result = await CountdownService.getCountdowns(shop, {
            page: Number(page),
            limit: Number(limit),
            sortBy,
            order,
            query,
            status,
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
        const updated = await CountdownService.updateCountdown(id, req.body);
        res.status(200).json({ success: true, item: updated });
    } catch (err) {
        console.error("Update Countdown Error:", err.message);
        res.status(400).json({ success: false, message: err.message });
    }
};

export const deleteCountdown = async (req, res) => {
    try {
        const { id } = req.params;
        await CountdownService.deleteCountdown(id);
        res.status(200).json({ success: true });
    } catch (err) {
        console.error("Delete Countdown Error:", err.message);
        res.status(400).json({ success: false, message: err.message });
    }
};