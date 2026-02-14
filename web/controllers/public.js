import CountdownService from "../services/countdown.js";

export const getActiveCountdown = async (req, res) => {
    try {
        const { shop } = req.params;

        const countdown = await CountdownService.getActiveCountdown(shop);

        return res.json({
            success: true,
            countdown,
        });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};