import { action, decorate, observable } from "mobx";
import React from "react";

export default class ExpenseStore {
  reference = {};
  connected = false;
  isLoading = false;
  get_statement = false;
  all_statement = [];
  profit_table = [];
  calculate_balance = false;
  synth_count = 0;
  frx_count = 0;
  com_count = 0;
  crypt_count = 0;
  stock_count = 0;
  basket_count = 0;
  profile = {
    login_id: "",
    total_balance: 0,
    token: { authorize: "" },
    expense_item: [],
  };
  contract_proposal = { proposal_id: "" };
  contract_portfolio = {
    contract_id: "",
  };
  buy_settings = {
    buy_price: 10,
    basis: "payout",
    duration_unit: "m",
    symbol: "R_100",
  };
  getConnected() {
    this.profile.token.authorize.length !== 15
      ? this.ErrorMessage()
      : this.ReadyToConnect();
  }

  ErrorMessage() {
    alert("Check Your Token Again");
  }

  ReadyToConnect() {
    this.connected ? this.Disconnect() : this.Connect();
  }

  ConnectWS() {
    this.reference.current = new WebSocket(
      "wss://ws.binaryws.com/websockets/v3?app_id=1089"
    );
    this.isLoading = true;
  }

  Connect() {
    this.ConnectWS();
    this.reference.current.onopen = (msg) => {
      this.SendAuthorizeRequest();
    };
    this.reference.current.onmessage = (msg) => {
      let data = JSON.parse(msg.data);

      this.SwitchStatement(data);
    };
    this.reference.current.onclose = (msg) => {};
    this.reference.current.onerror = (msg) => {};
  }

  SendAuthorizeRequest() {
    this.reference.current.send(JSON.stringify(this.profile.token));
  }

  GetProfitTable() {
    this.reference.current.send(
      JSON.stringify({
        profit_table: 1,
        description: 1,
        limit: 25,
        offset: 0,
        sort: "ASC",
      })
    );
    this.get_statement = true;
  }

  SwitchStatement(data) {
    switch (data.msg_type) {
      case "authorize":
        if (data.error === undefined) {
          this.profile.login_id = data.authorize.loginid;
          this.reference.current.send(
            JSON.stringify({
              balance: 1,
              subscribe: 1,
            })
          );
          this.isLoading = false;
          this.connected = true;
        } else {
          alert(data.error.code);
          this.isLoading = false;
          this.connected = false;
        }

        break;

      case "balance":
        this.profile.total_balance = data.balance.balance;
        this.get_statement
          ? this.reference.current.send(
              JSON.stringify({
                statement: 1,
                description: 1,
                limit: 5,
                offset: 0,
              })
            )
          : this.GetProfitTable();

        break;

      case "statement":
        this.all_statement.push({
          contract_id: data.statement.transactions[0].contract_id,
          amount: data.statement.transactions[0].amount,
          trade_item: data.statement.transactions[0].shortcode,
        });
        this.GetProfitTable();
        this.CalculateExpense();
        break;
      case "profit_table":
        this.profit_table = [];
        data.profit_table.transactions.forEach((profit) => {
          this.profit_table.push({
            contract_id: profit.contract_id,
            duration_type: profit.duration_type,
            buy_price: profit.buy_price,
            sell_price: profit.sell_price,
            transaction_id: profit.transaction_id,
            profit_or_loss: (profit.sell_price - profit.buy_price).toFixed(2),
          });
        });
        console.log(this.profit_table);
        break;
      case "proposal":
        this.contract_proposal.proposal_id = data?.proposal?.id;
        this.setContractProposal();
        break;
      case "portfolio":
        this.contract_portfolio.contract_id =
          data.portfolio?.contracts[0]?.contract_id;
        this.setContractPortifolio();
        break;
      case "buy":
        alert("Contract Bought");
        console.log(data);
        break;
      case "sell":
        alert("Contract Sold");
        console.log(data);
        break;
      default:
        break;
    }
  }
  setContractProposal = () => {
    this.reference.current.send(
      JSON.stringify({
        buy: this.contract_proposal.proposal_id,
        price: 100,
      })
    );
  };
  setBuyPrice(price) {
    this.buy_settings.buy_price = price;
  }
  setBasis(basis) {
    this.buy_settings.basis = basis;
  }
  setDurationUnit(duration_unit) {
    this.buy_settings.duration_unit = duration_unit;
  }
  setSymbol(symbol) {
    this.buy_settings.symbol = symbol;
  }
  setContractPortifolio = () => {
    this.reference.current.send(
      JSON.stringify({
        sell: this.contract_portfolio.contract_id,
        price: 100,
      })
    );
  };

  CalculateExpense() {
    let expenses_info = [];
    let valueArr = [];

    valueArr = this.all_statement.map(function (item) {
      return item.contract_id;
    });
    const toFindDuplicates = (arry) =>
      arry.filter((item, index) => arry.indexOf(item) !== index);
    const duplicateElements = toFindDuplicates(valueArr);

    let count_synth = 0;
    let count_frx = 0;
    let count_com = 0;
    let count_crypt = 0;
    let count_sind = 0;
    let count_bind = 0;

    duplicateElements.forEach((item) => {
      let calculate_expense = 0;
      let trade_item = "";
      let color = "";
      let gainloss = "";

      this.all_statement.forEach((thing) => {
        if (thing.contract_id === item) {
          calculate_expense = calculate_expense + thing.amount;
          if (thing.trade_item.includes("FRXX")) {
            trade_item = "Commodities";
          } else if (thing.trade_item.includes("OTC")) {
            trade_item = "Stock Indices";
          } else if (thing.trade_item.includes("WLD")) {
            trade_item = "Basket Indices";
          } else if (thing.trade_item.includes("1HZ")) {
            trade_item = "Synthetic Indices";
          } else if (thing.trade_item.includes("CRY")) {
            trade_item = "Cryptocurrencies";
          } else {
            trade_item = "Forex";
          }
        }
      });

      if (calculate_expense < 0) {
        color = "red";
        gainloss = "LOSS";
      } else if (calculate_expense > 0) {
        color = "green";
        gainloss = "GAIN";
      } else {
        color = "black";
        gainloss = "NULL";
      }

      switch (trade_item) {
        case "Synthetic Indices":
          count_synth++;
          this.synth_count = count_synth;
          break;
        case "Commodities":
          count_com++;
          this.com_count = count_com;
          break;
        case "Stock Indices":
          count_sind++;
          this.stock_count = count_sind;
          break;
        case "Basket Indices":
          count_bind++;
          this.basket_count = count_bind;
          break;
        case "Cryptocurrencies":
          count_crypt++;
          this.crypt_count = count_crypt;
          break;
        default:
          count_frx++;
          this.frx_count = count_frx;
          break;
      }

      expenses_info.push({
        expense: calculate_expense.toFixed(2),
        category: trade_item,
        color: color,
        gain_loss: gainloss,
      });

      this.profile.expense_item = expenses_info;
    });
  }
  buyContract = () => {
    this.reference.current.send(
      JSON.stringify({
        proposal: 1,
        amount: this.buy_settings.buy_price,
        // barrier: "+0.1",
        basis: this.buy_settings.basis,
        contract_type: "CALL",
        currency: "USD",
        duration: 10,
        duration_unit: this.buy_settings.duration_unit,
        symbol: this.buy_settings.symbol,
      })
    );
  };

  sellContract = () => {
    this.reference.current.send(
      JSON.stringify({
        portfolio: 1,
      })
    );
  };

  Disconnect() {
    this.reference.current.onclose = (msg) => {
      this.isLoading = false;
      this.connected = false;
      this.profile.total_balance = 0;
      this.profile.expense_item = [];
      this.profile.token.authorize = "";
      this.get_statement = false;
      this.all_statement = [];
      this.calculate_balance = false;
      this.synth_count = 0;
      this.frx_count = 0;
      this.com_count = 0;
      this.crypt_count = 0;
      this.stock_count = 0;
      this.basket_count = 0;
    };
    return this.reference.current.close();
  }
}

decorate(ExpenseStore, {
  connected: observable,
  isLoading: observable,
  get_statement: observable,
  all_statement: observable,
  calculate_balance: observable,
  synth_count: observable,
  frx_count: observable,
  com_count: observable,
  crypt_count: observable,
  stock_count: observable,
  basket_count: observable,
  profile: observable,
  profit_table: observable,
  getConnected: action.bound,
  buy_settings: observable,
  setBuyPrice: action.bound,
  setBasis: action.bound,
  setSymbol: action.bound,
  setDurationUnit: action.bound,
});

let store_context;

export const useStore = () => {
  if (!store_context) {
    const expenseStore = new ExpenseStore();

    store_context = React.createContext(expenseStore);
  }

  return React.useContext(store_context);
};
