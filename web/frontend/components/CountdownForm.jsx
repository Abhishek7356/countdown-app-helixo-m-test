import {
    FormLayout,
    TextField,
    Select,
    Button,
    Toast,
    Frame,
} from "@shopify/polaris";
import { useState, useCallback } from "react";

export default function CountdownForm({ onClose }) {
    const [form, setForm] = useState({
        title: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        description: "",
        bgColor: "#22c55e",
        textColor: "#ffffff",
        size: "medium",
        position: "top",
        urgency: "none",
    });

    const [loading, setLoading] = useState(false);
    const [toastActive, setToastActive] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const toggleToast = useCallback(
        () => setToastActive((active) => !active),
        []
    );

    const handleChange = (field) => (value) =>
        setForm({ ...form, [field]: value });

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const res = await fetch("/api/countdown/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (data.success) {
                setToastMessage("Timer created successfully");
                setToastActive(true);
                onClose();
            } else {
                setToastMessage(data.message || "Error occurred");
                setToastActive(true);
            }
        } catch (err) {
            setToastMessage("Something went wrong");
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
        { label: "None", value: "none" },
        { label: "Color pulse", value: "pulse" },
    ];

    const toastMarkup = toastActive ? (
        <Toast content={toastMessage} onDismiss={toggleToast} />
    ) : null;

    return (
        <Frame>
            <FormLayout>

                <TextField
                    label="Timer name"
                    value={form.title}
                    onChange={handleChange("title")}
                    autoComplete="off"
                />

                <FormLayout.Group>
                    <TextField
                        label="Start date"
                        type="date"
                        value={form.startDate}
                        onChange={handleChange("startDate")}
                    />
                    <TextField
                        label="Start time"
                        type="time"
                        value={form.startTime}
                        onChange={handleChange("startTime")}
                    />
                </FormLayout.Group>

                <FormLayout.Group>
                    <TextField
                        label="End date"
                        type="date"
                        value={form.endDate}
                        onChange={handleChange("endDate")}
                    />
                    <TextField
                        label="End time"
                        type="time"
                        value={form.endTime}
                        onChange={handleChange("endTime")}
                    />
                </FormLayout.Group>

                <TextField
                    label="Promotion description"
                    multiline={3}
                    value={form.description}
                    onChange={handleChange("description")}
                />

                <FormLayout.Group>
                    <TextField
                        label="Background color"
                        type="color"
                        value={form.bgColor}
                        onChange={handleChange("bgColor")}
                    />

                    <TextField
                        label="Text color"
                        type="color"
                        value={form.textColor}
                        onChange={handleChange("textColor")}
                    />
                </FormLayout.Group>

                <FormLayout.Group>
                    <Select
                        label="Timer size"
                        options={sizeOptions}
                        value={form.size}
                        onChange={handleChange("size")}
                    />

                    <Select
                        label="Timer position"
                        options={positionOptions}
                        value={form.position}
                        onChange={handleChange("position")}
                    />
                </FormLayout.Group>

                <Select
                    label="Urgency notification"
                    options={urgencyOptions}
                    value={form.urgency}
                    onChange={handleChange("urgency")}
                />

                <Button
                    variant="primary"
                    loading={loading}
                    onClick={handleSubmit}
                >
                    Create timer
                </Button>

            </FormLayout>

            {toastMarkup}
        </Frame>
    );
}
