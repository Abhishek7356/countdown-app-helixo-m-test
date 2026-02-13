import { Modal, Text } from "@shopify/polaris";

export default function DeleteConfirmModal({ open, onClose, onConfirm }) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Delete Countdown"
            primaryAction={{
                content: "Delete",
                tone: "critical",
                onAction: onConfirm,
            }}
            secondaryActions={[{ content: "Cancel", onAction: onClose }]}
        >
            <Modal.Section>
                <Text>Are you sure you want to delete this countdown?</Text>
            </Modal.Section>F
        </Modal>
    );
}
