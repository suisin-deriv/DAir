import React from "react";
import { observer } from "mobx-react";
import { useStore } from "../../store/ExepnseStore";
import "./CurrentTrades.scss";

const CurrentTrades = () => {
  const expense_store = useStore();
  const { current_bought_items, sellContract } = expense_store;

  return (
    <div className="history">
      <div className="message">
        <span>Current Trades</span>
      </div>
      <div className="history__container">
        {current_bought_items.length > 0 ? (
          current_bought_items.reverse().map((item) => {
            return (
              <React.Fragment>
                <div className="history__container--card">
                  <div className="history__container--card__content">
                    <strong>Buy Time</strong>
                    <span>
                      {item.purchase_time.slice(
                        0,
                        item.purchase_time.indexOf("G")
                      )}
                    </span>
                    <strong>Buy Price</strong>
                    <span>${item.buy_price}</span>
                  </div>
                  <div className="history__container--card__content">
                    <strong>Payout</strong>
                    <span>{item.payout}</span>
                    <strong>Transaction ID</strong>
                    <span>${item.transaction_id}</span>
                  </div>
                  <button
                    className="market--container__btn--sell"
                    onClick={() => {
                      sellContract(item.contract_id);
                    }}
                  >
                    Sell
                  </button>
                </div>
              </React.Fragment>
            );
          })
        ) : (
          <div className="history__container--login">
            <span>
              Your have not trade anyting yet. Connect your Account and start
              trading.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default observer(CurrentTrades);
