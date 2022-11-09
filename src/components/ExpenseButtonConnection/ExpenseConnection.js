import React from "react";
import { observer } from "mobx-react";
import { useStore } from "../../store/ExepnseStore";
import "./ExpenseConnection.scss";
import "../../style/style.scss";

const ExpenseConnection = () => {
  const expenseStore = useStore();
  const { getConnected, profile, connected, isLoading } = expenseStore;

  return (
    <div className="connection">
      <div className="message">
        <span>Enter Deriv API Token</span>
      </div>
      {connected ? (
        <div className="connection--container">
          <div className="connection--container__login">
            <p>{profile.login_id}</p>
          </div>
          <button onClick={getConnected}>Disconnect</button>
        </div>
      ) : (
        <div className="connection--container">
          <input
            placeholder="Token"
            onChange={(e) => {
              profile.token.authorize = e.target.value;
            }}
          />
          {isLoading ? (
            <button className="disabled">Loading</button>
          ) : (
            <button onClick={getConnected}>Connect</button>
          )}
        </div>
      )}
    </div>
  );
};

export default observer(ExpenseConnection);
