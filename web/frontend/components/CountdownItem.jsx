import { ResourceList, Badge, Text, Button, InlineStack } from "@shopify/polaris";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { useState } from "react";

export default function CountdownItem({ item, onEdit, refresh }) {
    const [deleteOpen, setDeleteOpen] = useState(false);

    const handleDelete = async () => {
        await fetch(`/api/countdown/delete/${item._id}`, {
            method: "DELETE",
        });
        setDeleteOpen(false);
        refresh();
    };

    return (
        <>
            <ResourceList.Item id={item._id}>
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <div>
                        <Text variant="bodyMd" fontWeight="bold">
                            {item.title}
                        </Text>
                        <div style={{ fontSize: 12, opacity: 0.7 }}>
                            {new Date(item.startAt).toLocaleString()} →
                            {new Date(item.endAt).toLocaleString()}
                        </div>
                        <Badge tone={item.isActive ? "success" : "critical"}>
                            {item.isActive ? "Active" : "Inactive"}
                        </Badge>
                    </div>

                    <InlineStack gap="300">
                        <Button size="slim" onClick={() => onEdit(item)}>Edit</Button>
                        <Button size="slim" tone="critical" onClick={() => setDeleteOpen(true)}>
                            Delete
                        </Button>
                    </InlineStack>
                </div>
            </ResourceList.Item>

            <DeleteConfirmModal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
            />
        </>
    );
}
