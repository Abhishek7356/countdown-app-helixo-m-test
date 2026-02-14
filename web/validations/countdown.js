import Joi from "joi";


export const createCountdownSchema = Joi.object({
    title: Joi.string().required().messages({
        "string.empty": "Title is required",
    }),
    description: Joi.string().allow(""),
    startDate: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .required()
        .messages({
            "string.pattern.base": "Start date must be in YYYY-MM-DD format",
            "any.required": "Start date is required",
        }),
    endDate: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .required()
        .messages({
            "string.pattern.base": "End date must be in YYYY-MM-DD format",
            "any.required": "End date is required",
        }),
    startTime: Joi.string()
        .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
        .required()
        .messages({
            "string.pattern.base": "Start time must be in HH:mm format",
            "any.required": "Start time is required",
        }),
    endTime: Joi.string()
        .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
        .required()
        .messages({
            "string.pattern.base": "End time must be in HH:mm format",
            "any.required": "End time is required",
        }),
    bgColor: Joi.string().default("#ffffff"),
    textColor: Joi.string().default("#000000"),
    fontSize: Joi.string().default("16px"),
    size: Joi.string().valid("small", "medium", "large").default("medium"),
    position: Joi.string().valid("top", "bottom").default("top"),
    urgency: Joi.string().valid("pulse", "banner").default("pulse"),
    isActive: Joi.boolean().default(true),
});


export const updateCountdownSchema = Joi.object({
    title: Joi.string(),
    description: Joi.string().allow(""),
    startDate: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .messages({
            "string.pattern.base": "Start date must be in YYYY-MM-DD format",
        }),
    endDate: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .messages({
            "string.pattern.base": "End date must be in YYYY-MM-DD format",
        }),
    startTime: Joi.string().pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/).messages({
        "string.pattern.base": "Start time must be in HH:mm format",
    }),
    endTime: Joi.string().pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/).messages({
        "string.pattern.base": "End time must be in HH:mm format",
    }),
    bgColor: Joi.string(),
    textColor: Joi.string(),
    fontSize: Joi.string(),
    size: Joi.string().valid("small", "medium", "large"),
    position: Joi.string().valid("top", "bottom"),
    urgency: Joi.string().valid("pulse", "banner"),
    isActive: Joi.boolean(),
}).min(1); 
