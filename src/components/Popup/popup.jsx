import { observer } from "mobx-react";
import React from "react";
import { useStore } from "../../store/ExepnseStore";

const Popup = () => {
  const expense_store = useStore();
  const { error, message, clearError, clearMessage } = expense_store;
  return (
    <div
      class="popup hidden"
      onClick={(e) => {
        clearError();
        clearMessage();
      }}
    >
      <div class="popup-content">
        <span>{message || error}</span>
      </div>
    </div>
  );
};

export default observer(Popup);
