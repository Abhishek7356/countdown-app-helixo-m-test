import Countdown from "../models/Countdown.js";

class CountdownService {
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
        });

        return countdown;
    }

    static async getCountdowns(shop, options) {
        const { page, limit, sortBy, order, query, status, startFrom, startTo } = options;

        const skip = (page - 1) * limit;
        const sortOrder = order === "asc" ? 1 : -1;

        const filter = { shop };
        // 🔎 Search by title
        if (query) {
            filter.title = { $regex: query, $options: "i" };
        }

        // 🔘 Filter by status
        if (status !== undefined) {
            filter.isActive = status === "active";
        }

        // 📅 Filter by start date range
        if (startFrom || startTo) {
            filter.startAt = {};
            if (startFrom) filter.startAt.$gte = new Date(startFrom);
            if (startTo) filter.startAt.$lte = new Date(startTo);
        }

        const [items, total] = await Promise.all([
            Countdown.find(filter)
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit)
                .lean(),

            Countdown.countDocuments(filter),
        ]);

        return {
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
    }
}

export default CountdownService;
