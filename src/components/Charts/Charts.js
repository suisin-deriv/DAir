import React from "react";
import { useStore } from "../../store/ExepnseStore";
import "./Chart.scss";
import "../../style/style.scss";
import ExpenseConnection from "../ExpenseButtonConnection/ExpenseConnection";
import { observer } from "mobx-react";

const Charts = () => {
  const expense_store = useStore();
  const {
    buy_settings,
    setSymbol,
    setBasis,
    setBuyPrice,
    setDurationUnit,
    markets,
    symbols,
    assets,
    setAssets,
    setSelectedSymbol,
    price,
    color,
    buyContract,
    sellContract,
    setDuration,
  } = expense_store;
  return (
    <div className="market">
      <div className="market--container">
        <ExpenseConnection />
        <div className="market--container__price">
          {price === 0 ? (
            <h3>Select Markets and Assets</h3>
          ) : (
            <h3 style={{ color: `${color}` }}>{price}</h3>
          )}
        </div>
        <div className="market--container__content">
          <select
            onChange={(e) => {
              if (e.target.value) {
                setAssets(symbols.filter((a) => a.market === e.target.value));
              }
            }}
          >
            <option value="">Select a market</option>
            {markets?.map((m) => {
              return (
                <option key={m.id} value={m.id}>
                  {m.display_name}
                </option>
              );
            })}
          </select>
          <select
            onChange={(e) => {
              if (e.target.value) {
                setSelectedSymbol(e.target.value);
                setSymbol(e.target.value);
              }
            }}
          >
            <option value="">Select an asset</option>
            {assets?.map((a) => {
              return (
                <option key={a.symbol} value={a.symbol}>
                  {a.display_name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="market--container__content">
          <input
            type="number"
            value={buy_settings.buy_price}
            onChange={(e) => {
              setBuyPrice(Number(e.target.value));
            }}
          />
          <button
            disabled={buy_settings.basis !== "stake"}
            onClick={() => setBasis("stake")}
          >
            Stake
          </button>
          <button
            disabled={buy_settings.basis !== "payout"}
            onClick={() => setBasis("payout")}
          >
            Payout
          </button>
        </div>
        <div className="market--container__content">
          <button className="transparent" onClick={() => setDurationUnit("t")}>
            Tick
          </button>
          <button className="transparent" onClick={() => setDurationUnit("m")}>
            Minutes
          </button>
          <input
            type="number"
            value={buy_settings.duration}
            onChange={(e) => {
              setDuration(Number(e.target.value));
            }}
          />
        </div>
        <div className="market--container__btn">
          <button
            className="buy market--container__btn--buy"
            onClick={buyContract}
          >
            Buy
          </button>
          <button
            className="market--container__btn--sell"
            onClick={sellContract}
          >
            Sell
          </button>
        </div>
      </div>
    </div>
  );
};

export default observer(Charts);
