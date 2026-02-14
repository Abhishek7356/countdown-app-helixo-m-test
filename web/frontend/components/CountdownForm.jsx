import {
    FormLayout,
    TextField,
    Select,
    Button,
    Toast,
} from "@shopify/polaris";

import { useState, useCallback } from "react";
import { splitDateTime } from "../utils/dateUtils";
import { useDispatch } from "react-redux";
import { fetchCountdowns, createCountdown, updateCountdown } from "../store/countdownSlice";
import { countdownSchema } from "../validations/countdown";

export default function CountdownForm({ onClose, timer }) {
    const start = splitDateTime(timer?.startAt);
    const end = splitDateTime(timer?.endAt);

    const [form, setForm] = useState({
        title: timer?.title || "",
        startDate: start.date,
        startTime: start.time,
        endDate: end.date,
        endTime: end.time,
        description: timer?.description || "",
        bgColor: timer?.bgColor || "#22c55e",
        textColor: timer?.textColor || "#ffffff",
        size: timer?.size || "medium",
        position: timer?.position || "top",
        urgency: timer?.urgency || "pulse",
        isActive: timer?.isActive || false,
    });

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [toastActive, setToastActive] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const toggleToast = useCallback(() => setToastActive((active) => !active), []);

    const handleChange = (field) => (value) => setForm({ ...form, [field]: value });

    const handleStatusChange = (value) => {
        setForm({ ...form, isActive: value === "true" });
    };
    const handleSubmit = async (action) => {
        try {
            setLoading(true);
            const startAt = new Date(`${form.startDate}T${form.startTime}`);
            const endAt = new Date(`${form.endDate}T${form.endTime}`);

            if (isNaN(startAt.getTime()) || isNaN(endAt.getTime())) {
                throw new Error("Invalid date or time format");
            }

            if (endAt <= startAt) {
                throw new Error("End time must be greater than start time");
            }

            // ===============================
            // YUP VALIDATION
            // ===============================
            await countdownSchema.validate(form, { abortEarly: false });

            if (action === "edit") {
                await dispatch(updateCountdown({ id: timer._id, form })).unwrap();
                setToastMessage("Timer updated successfully");
            } else {
                await dispatch(createCountdown(form)).unwrap();
                setToastMessage("Timer created successfully");
            }

            setToastActive(true);
            onClose();
            dispatch(fetchCountdowns({ page: 1, filters: "" }));

        } catch (err) {
            if (err.inner) {
                setToastMessage(err.inner.map((e) => e.message).join(", "));
            } else {
                setToastMessage(err.message || "Something went wrong");
            }
            setToastActive(true);
        } finally {
            setLoading(false);
        }
    };
    const sizeOptions = [
        { label: "Small", value: "small" },
        { label: "Medium", value: "medium" },
        { label: "Large", value: "large" },
    ];

    const positionOptions = [
        { label: "Top", value: "top" },
        { label: "Bottom", value: "bottom" },
    ];

    const urgencyOptions = [
        { label: "Color pulse", value: "pulse" },
        { label: "notification banner", value: "banner" },
    ];

    const statusOption = [
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
    ];

    const toastMarkup = toastActive ? <Toast content={toastMessage} onDismiss={toggleToast} /> : null;

    return (
        <FormLayout>
            <TextField label="Timer name" value={form.title} onChange={handleChange("title")} autoComplete="off" />

            <FormLayout.Group>
                <TextField label="Start date" type="date" value={form.startDate} onChange={handleChange("startDate")} />
                <TextField label="Start time" type="time" value={form.startTime} onChange={handleChange("startTime")} />
            </FormLayout.Group>

            <FormLayout.Group>
                <TextField label="End date" type="date" value={form.endDate} onChange={handleChange("endDate")} />
                <TextField label="End time" type="time" value={form.endTime} onChange={handleChange("endTime")} />
            </FormLayout.Group>

            <TextField label="Promotion description" multiline={3} value={form.description} onChange={handleChange("description")} />

            <FormLayout.Group>
                <TextField label="Background color" type="color" value={form.bgColor} onChange={handleChange("bgColor")} />
                <TextField label="Text color" type="color" value={form.textColor} onChange={handleChange("textColor")} />
            </FormLayout.Group>

            <FormLayout.Group>
                <Select label="Timer size" options={sizeOptions} value={form.size} onChange={handleChange("size")} />
                <Select label="Timer position" options={positionOptions} value={form.position} onChange={handleChange("position")} />
            </FormLayout.Group>
            <FormLayout.Group>
                <Select label="Urgency notification" options={urgencyOptions} value={form.urgency} onChange={handleChange("urgency")} />
                <Select
                    label="Status"
                    options={statusOption}
                    value={form.isActive ? "true" : "false"}
                    onChange={handleStatusChange}
                />
            </FormLayout.Group>
            <Button
                variant="primary"
                loading={loading}
                onClick={() => handleSubmit(timer ? "edit" : "create")}
            >
                {timer ? "Update timer" : "Create timer"}
            </Button>
            {toastMarkup}
        </FormLayout>
    );
}
