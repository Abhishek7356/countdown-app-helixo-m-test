import Countdown from "../models/Countdown.js";

export const getActiveCountdown = async (req, res) => {
    try {
        const { shop } = req.params;
        console.log(shop)
        const now = new Date();

        const countdown = await Countdown.findOne({
            shop,
            isActive: true,
            startAt: { $lte: now },
            endAt: { $gte: now },
        }).lean();

        if (!countdown) {
            return res.json({ success: true, countdown: null });
        }

        res.json({
            success: true,
            countdown,
        });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};
