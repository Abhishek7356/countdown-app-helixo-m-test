import Countdown from "../models/Countdown.js";
import {
    getCache,
    setCache,
    clearKeyCaches,
} from "../utils/redisUtils.js";

class CountdownService {
    static generateListCacheKey(shop, options) {
        const {
            page = 1,
            limit = 10,
            query = "",
            status = "",
        } = options;

        return `countdowns:${shop}:page=${page}:limit=${limit}:query=${query}:status=${status}`;
    }

    static generateActiveCacheKey(shop) {
        return `countdowns:${shop}:active`;
    }

    static async createCountdown(shop, payload) {
        const {
            title,
            description,
            startDate,
            startTime,
            endDate,
            endTime,
            bgColor,
            textColor,
            size,
            position,
            urgency,
            isActive,
        } = payload;

        if (!title || !startDate || !startTime || !endDate || !endTime) {
            throw new Error("All required fields must be provided");
        }

        const startAt = new Date(`${startDate}T${startTime}`);
        const endAt = new Date(`${endDate}T${endTime}`);

        if (isNaN(startAt) || isNaN(endAt)) {
            throw new Error("Invalid date or time format");
        }

        if (endAt <= startAt) {
            throw new Error("End time must be greater than start time");
        }

        if (isActive) {
            await Countdown.updateMany(
                { shop, isActive: true },
                { $set: { isActive: false } }
            );
        }

        const countdown = await Countdown.create({
            shop,
            title,
            description,
            startAt,
            endAt,
            bgColor,
            textColor,
            size,
            position,
            urgency,
            isActive: isActive !== undefined ? isActive : true,
        });

        await clearKeyCaches(`countdowns:${shop}:*`);

        return countdown;
    }

    static async getCountdowns(shop, options) {
        const cacheKey = this.generateListCacheKey(shop, options);

        const cachedData = await getCache(cacheKey);
        if (cachedData) {
            console.log("⚡ Cache Hit");
            return cachedData;
        }

        console.log("🗄 Cache Miss - Fetching from DB");

        const {
            page = 1,
            limit = 10,
            query,
            status,
        } = options;

        const skip = (page - 1) * limit;

        const filter = { shop };

        if (query) filter.title = { $regex: query, $options: "i" };
        if (status !== undefined) filter.isActive = status === "active";

        const [items, total] = await Promise.all([
            Countdown.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Countdown.countDocuments(filter),
        ]);

        const result = {
            items,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPrevPage: page > 1,
            },
        };

        await setCache(cacheKey, result, 60);

        return result;
    }

    static async updateCountdown(id, payload) {
        const { isActive, startDate, startTime, endDate, endTime, ...rest } =
            payload;

        const countdown = await Countdown.findById(id);
        if (!countdown) throw new Error("Countdown not found");

        const updateData = { ...rest };

        let newStartAt = countdown.startAt;
        let newEndAt = countdown.endAt;

        if (startDate && startTime) {
            newStartAt = new Date(`${startDate}T${startTime}`);
            if (isNaN(newStartAt)) {
                throw new Error("Invalid start date or time format");
            }
            updateData.startAt = newStartAt;
        }

        if (endDate && endTime) {
            newEndAt = new Date(`${endDate}T${endTime}`);
            if (isNaN(newEndAt)) {
                throw new Error("Invalid end date or time format");
            }
            updateData.endAt = newEndAt;
        }

        if (newEndAt <= newStartAt) {
            throw new Error("End time must be greater than start time");
        }
        if (isActive) {
            await Countdown.updateMany(
                {
                    shop: countdown.shop,
                    isActive: true,
                    _id: { $ne: id },
                },
                { $set: { isActive: false } }
            );

            updateData.isActive = true;
        } else if (isActive === false) {
            updateData.isActive = false;
        }

        const updated = await Countdown.findByIdAndUpdate(id, updateData, {
            new: true,
        });

        await clearKeyCaches(`countdowns:${countdown.shop}:*`);

        return updated;
    }

    static async deleteCountdown(id) {
        const countdown = await Countdown.findById(id);
        if (!countdown) throw new Error("Countdown not found");

        await Countdown.findByIdAndDelete(id);


        await clearKeyCaches(`countdowns:${countdown.shop}:*`);

        return true;
    }

    static async getActiveCountdown(shop) {
        const cacheKey = this.generateActiveCacheKey(shop);

        // 1️⃣ Check Redis
        const cached = await getCache(cacheKey);
        if (cached) {
            console.log("⚡ Active Countdown Cache Hit");
            return cached;
        }

        console.log("🗄 Active Countdown Cache Miss - Fetching from DB");

        const now = new Date();

        const countdown = await Countdown.findOne({
            shop,
            isActive: true,
            startAt: { $lte: now },
            endAt: { $gte: now },
        }).lean();

        const result = countdown || null;

        // 2️⃣ Cache for 60 seconds
        await setCache(cacheKey, result, 60);

        return result;
    }
}

export default CountdownService;
