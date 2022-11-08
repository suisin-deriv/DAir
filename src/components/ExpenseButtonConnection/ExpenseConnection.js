import React from "react";
import { observer } from "mobx-react";
import { useStore } from "../../store/ExepnseStore";
import "./ExpenseConnection.scss";

const ExpenseConnection = () => {
  const expenseStore = useStore();
  const { getConnected, profile, connected, isLoading } = expenseStore;

  return (
    <div className="connnection">
      <div className="connection--header">
        <p>Enter Deriv API Token</p>
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
            <button disabled>Loading</button>
          ) : (
            <button onClick={getConnected}>Connect</button>
          )}
        </div>
      )}
    </div>
  );
};

export default observer(ExpenseConnection);
