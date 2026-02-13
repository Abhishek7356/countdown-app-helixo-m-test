import { Page, Frame } from "@shopify/polaris";
import { useState } from "react";
import CountdownList from "../components/CountdownList";
import CountdownModal from "../components/CountdownModal";

export default function HomePage() {
  const [modalActive, setModalActive] = useState(false);
  const [editTimer, setEditTimer] = useState(null);

  const openCreate = () => {
    setEditTimer(null);
    setModalActive(true);
  };

  const openEdit = (timer) => {
    setEditTimer(timer);
    setModalActive(true);
  };

  return (
    <Frame>
      <Page
        title="Countdown Timer Manager"
        primaryAction={{ content: "Create timer", onAction: openCreate }}
      >
        <CountdownList onEdit={openEdit} />
        <CountdownModal
          active={modalActive}
          timer={editTimer}
          onClose={() => setModalActive(false)}
        />
      </Page>
    </Frame>
  );
}
