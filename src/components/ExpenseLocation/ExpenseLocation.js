import React from "react";
import { observer } from "mobx-react";
import { useStore } from "../../store/ExepnseStore";
import Expense from "../Expense/Expense";
import "./ExpenseLocation.scss";

const ExpenseLocation = () => {
  const expense_store = useStore();
  const { profile, synth_count, frx_count, com_count, crypt_count, stock_count, basket_count, buy_settings, setBuyPrice, setBasis, setDurationUnit } =
    expense_store;

  const [synthIsOpen, setSynthIsOpen] = React.useState(true);
  const [frxIsOpen, setFrxIsOpen] = React.useState(true);
  const [comIsOpen, setComIsOpen] = React.useState(true);
  const [cryptIsOpen, setCryptIsOpen] = React.useState(true);
  const [sindIsOpen, setSindIsOpen] = React.useState(true);
  const [bindIsOpen, setBindIsOpen] = React.useState(true);

  return (
    <React.Fragment>
      <input
        type="number"
        value={buy_settings.buy_price}
        onChange={(e) => {
          setBuyPrice(Number(e.target.value));
        }}
      />
      <div>
        <button onClick={expense_store.buyContract}>Buy</button>
        <button onClick={expense_store.sellContract}>Sell</button>
      </div>
      <div>
        <button onClick={() => setBasis("stake")}>Stake</button>
        <button onClick={() => setBasis("payout")}>Payout</button>
      </div>
      <div>
        <button onClick={() => setDurationUnit("t")}>Tick</button>
        <button onClick={() => setDurationUnit("m")}>Minutes</button>
      </div>
      {/* <div>
        <select onchange={ }>
          {[...Array.from(new Array(10)).keys()].map((tick) => {
            return <option value={tick + 1}>{tick + 1}</option>;
          })}
        </select>
      </div> */}
      <h1 className="expenses--title">Expense History</h1>
      <div className="expenses--container">
        <div className="expenses--container__synth">
          <div
            className="expenses--container__synth--header"
            onClick={() => {
              setSynthIsOpen(!synthIsOpen);
            }}>
            <span>Synthetic Indices</span>
            <div className="expenses--container__synth--header__counter">{synth_count}</div>
          </div>

          {synthIsOpen ? (
            <div className="expenses--container__synth--content">
              {profile.expense_item.map((element, index) =>
                element.category === "Synthetic Indices" ? (
                  <Expense key={index} color={element.color} gain_loss={element.gain_loss} expense={element.expense} />
                ) : null
              )}
            </div>
          ) : null}
        </div>

        <div className="expenses--container__frx">
          <div
            className="expenses--container__frx--header"
            onClick={() => {
              setFrxIsOpen(!frxIsOpen);
            }}>
            <span>Forex</span>
            <div className="expenses--container__synth--header__counter">{frx_count}</div>
          </div>

          {frxIsOpen ? (
            <div className="expenses--container__frx--content">
              {profile.expense_item.map((element, index) =>
                element.category === "Forex" ? (
                  <Expense key={index} color={element.color} gain_loss={element.gain_loss} expense={element.expense} />
                ) : null
              )}
            </div>
          ) : null}
        </div>

        <div className="expenses--container__com">
          <div
            className="expenses--container__com--header"
            onClick={() => {
              setComIsOpen(!comIsOpen);
            }}>
            <span>Commodities</span>
            <div className="expenses--container__synth--header__counter">{com_count}</div>
          </div>

          {comIsOpen ? (
            <div className="expenses--container__com--content">
              {profile.expense_item.map((element, index) =>
                element.category === "Commodities" ? (
                  <Expense key={index} color={element.color} gain_loss={element.gain_loss} expense={element.expense} />
                ) : null
              )}
            </div>
          ) : null}
        </div>

        <div className="expenses--container__crypt">
          <div
            className="expenses--container__crypt--header"
            onClick={() => {
              setCryptIsOpen(!cryptIsOpen);
            }}>
            <span>Cryptocurrencies</span>
            <div className="expenses--container__synth--header__counter">{crypt_count}</div>
          </div>

          {cryptIsOpen ? (
            <div className="expenses--container__crypt--content">
              {profile.expense_item.map((element, index) =>
                element.category === "Cryptocurrencies" ? (
                  <Expense key={index} color={element.color} gain_loss={element.gain_loss} expense={element.expense} />
                ) : null
              )}
            </div>
          ) : null}
        </div>

        <div className="expenses--container__sind">
          <div
            className="expenses--container__sind--header"
            onClick={() => {
              setSindIsOpen(!sindIsOpen);
            }}>
            <span>Stock Indices</span>
            <div className="expenses--container__synth--header__counter">{stock_count}</div>
          </div>

          {sindIsOpen ? (
            <div className="expenses--container__sind--content">
              {profile.expense_item.map((element, index) =>
                element.category === "Stock Indices" ? (
                  <Expense key={index} color={element.color} gain_loss={element.gain_loss} expense={element.expense} />
                ) : null
              )}
            </div>
          ) : null}
        </div>

        <div className="expenses--container__bind">
          <div
            className="expenses--container__bind--header"
            onClick={() => {
              setBindIsOpen(!bindIsOpen);
            }}>
            <span>Basket Indices</span>
            <div className="expenses--container__synth--header__counter">{basket_count}</div>
          </div>

          {bindIsOpen ? (
            <div className="expenses--container__bind--content">
              {profile.expense_item.map((element, index) =>
                element.category === "Basket Indices" ? (
                  <Expense key={index} color={element.color} gain_loss={element.gain_loss} expense={element.expense} />
                ) : null
              )}
            </div>
          ) : null}
        </div>
      </div>
    </React.Fragment>
  );
};

export default observer(ExpenseLocation);
