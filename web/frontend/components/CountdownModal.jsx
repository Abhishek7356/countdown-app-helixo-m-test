import { Frame, Modal } from "@shopify/polaris";
import CountdownForm from "./CountdownForm";

export default function CountdownModal({ active, onClose, timer }) {
    return (
        <Modal
            open={active}
            onClose={onClose}
            title={timer ? "Edit Timer" : "Create New Timer"}
            primaryAction={null}
            secondaryActions={[]}
            large
        >
            <Frame>
                <Modal.Section>
                    <CountdownForm onClose={onClose} timer={timer} />
                </Modal.Section>
            </Frame>
        </Modal>
    );
}
