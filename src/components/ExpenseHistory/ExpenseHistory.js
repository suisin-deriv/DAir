import React from "react";
import { observer } from "mobx-react";
import { useStore } from "../../store/ExepnseStore";
import "./ExpenseHistory.scss";

const ExpenseHistory = () => {
  const expense_store = useStore();
  const { profit_table } = expense_store;

  const capitalizeFirstLetter = (str) => {
    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
    return capitalized;
  };

  return (
    <div className="history">
      <div className="message">
        <span>Previous Trades</span>
      </div>
      <div className="history__container">
        {profit_table.length > 0 ? (
          profit_table.map((item) => {
            return (
              <div className="history__container--card">
                <div className="history__container--card__content">
                  <strong>Ref. ID</strong>
                  <span>{item.transaction_id}</span>
                  <strong>Duration</strong>
                  <span>{capitalizeFirstLetter(item.duration_type)}</span>
                </div>
                <div className="history__container--card__content">
                  <strong>Buy Price</strong>
                  <span>${item.buy_price}</span>
                  <strong>Sell Price</strong>
                  <span>${item.sell_price}</span>
                  <strong>Profit/Loss</strong>
                  <span>{item.profit_or_loss}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="history__container--login">
            <span>Connect your account via API key to view history</span>
          </div>
        )}
        {/* {profit_table.map((item) => {
          console.log(item);
          return (
            <div className="history__container--card">
              <div className="history__container--card__content">
                <strong>Ref. ID</strong>
                <span>{item.transaction_id}</span>
                <strong>Duration</strong>
                <span>{capitalizeFirstLetter(item.duration_type)}</span>
              </div>
              <div className="history__container--card__content">
                <strong>Buy Price</strong>
                <span>${item.buy_price}</span>
                <strong>Sell Price</strong>
                <span>${item.sell_price}</span>
                <strong>Profit/Loss</strong>
                <span>{item.profit_or_loss}</span>
              </div>
            </div>
          );
        })} */}
      </div>
    </div>
  );
};

export default observer(ExpenseHistory);
