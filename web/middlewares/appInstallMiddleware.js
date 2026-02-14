import Store from "../models/Store.js";

export const appInstallMiddleware = async (req, res, next) => {
    try {
        const session = res.locals.shopify.session;
        const shop = session?.shop;
        const accessToken = session?.accessToken;

        if (!shop || !accessToken) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        await Store.findOneAndUpdate(
            { shopUrl: shop },
            { shopUrl: shop, accessToken, isActive: true, installedAt: new Date() },
            { upsert: true, new: true }
        );

        next();
    } catch (error) {
        console.error("App Install Middleware Error:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}