import React from "react";
import { observer } from "mobx-react";
import { useStore } from "../../store/ExepnseStore";

const ExpenseHistory = () => {
  const expense_store = useStore();
  const { profit_table } = expense_store;

  return (
    <React.Fragment>
      <table>
        <thead>
          <tr>
            <th>Duration Type</th>
            <th>Buy Price</th>
            <th>Sell Price</th>
            <th>Transaction ID</th>
            <th>Profit/Loss</th>
          </tr>
        </thead>
        <tbody>
          {profit_table.map((item) => {
            console.log(item);
            return (
              <tr id={item.contract_id}>
                <td>{item.duration_type}</td>
                <td>{item.buy_price}</td>
                <td>{item.sell_price}</td>
                <td>{item.transaction_id}</td>
                <td>{item.profit_or_loss}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </React.Fragment>
  );
};

export default observer(ExpenseHistory);
