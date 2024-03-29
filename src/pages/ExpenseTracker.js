import React from "react";
import ExpenseBalance from "../components/ExpenseBalance/ExpenseBalance";
import ExpenseHistory from "../components/ExpenseHistory/ExpenseHistory";
import CurrentTrades from "../components/CurrentTrades/CurrentTrades";
import Charts from "../components/Charts/Charts";
import "../style/style.scss";

function ExpenseTracker() {
  return (
    <div className="main-container">
      <div className="header">
        <ExpenseBalance />
      </div>
      <div className="body">
        <div>
          <CurrentTrades />
        </div>
        <div>
          <Charts />
        </div>
        <div>
          <ExpenseHistory />
        </div>
      </div>
      <div className="footer">
        <span>
          We are looking for investors please contact{" "}
          {
            <a
              style={{ color: "white", fontWeight: "bold" }}
              href="https://ug.linkedin.com/in/jimdanielswasswa"
            >
              Jim Daniels
            </a>
          }
        </span>
      </div>
    </div>
  );
}

export default ExpenseTracker;
