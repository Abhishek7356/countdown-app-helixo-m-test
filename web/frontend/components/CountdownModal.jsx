import { Modal } from "@shopify/polaris";
import CountdownForm from "./CountdownForm";

export default function CountdownModal({ active, onClose }) {
    return (
        <Modal
            open={active}
            onClose={onClose}
            title="Create New Timer"
            primaryAction={null}
            secondaryActions={[]}
            large
        >
            <Modal.Section>
                <CountdownForm onClose={onClose} />
            </Modal.Section>
        </Modal>
    );
}
