import React from "react";
import { useStore } from "../../store/ExepnseStore";
import "./Chart.scss";
import "../../style/style.scss";
import ExpenseConnection from "../ExpenseButtonConnection/ExpenseConnection";

export default function Charts() {
  const expense_store = useStore();
  const { buy_settings, setSymbol, setBasis, setBuyPrice, setDurationUnit } = expense_store;
  const api = React.useRef();
  const [active_symbols, setActiveSymbols] = React.useState();
  const [markets_list, setMarketsList] = React.useState([]);
  const [asset_list, setAssetList] = React.useState([]);
  const [selected_symbol, setSelectedSymbol] = React.useState(buy_settings.symbol);
  const [tick_id, setTickId] = React.useState("");
  const [price, setPrice] = React.useState(0);
  const [color, setColor] = React.useState("black");

  React.useEffect(() => {
    api.current = new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089");
    api.current.addEventListener("open", () => {
      api.current?.send(
        JSON.stringify({
          active_symbols: "brief",
          product_type: "basic",
        })
      );
    });

    api.current.addEventListener("message", (response) => {
      const data = JSON.parse(response.data);
      // eslint-disable-next-line default-case
      switch (data.msg_type) {
        case "active_symbols":
          let temp_markets = [];
          const symbols = data.active_symbols;
          symbols.forEach((s) => {
            const new_market = {
              id: s.market,
              display_name: s.market_display_name,
            };
            if (!temp_markets.find((m) => JSON.stringify(m) === JSON.stringify(new_market))) {
              temp_markets.push(new_market);
            }
          });
          setActiveSymbols(symbols);
          setMarketsList(temp_markets);
          break;
        case "tick":
          setTickId(data.tick.id);
          setPrice((prev) => {
            const current = data.tick.quote;
            if (current > prev) {
              setColor("green");
            } else if (current < prev) {
              setColor("red");
            } else {
              setColor("gray");
            }
            return current;
          });
          break;
      }
    });
    return () => {
      api.current?.close();
    };
  }, []);
  React.useEffect(() => {
    if (api.current?.readyState === 1) {
      if (selected_symbol && tick_id) {
        api.current.send(JSON.stringify({ forget: tick_id }));
        setPrice(0);
        setColor("black");
      }
      api.current.send(
        JSON.stringify({
          ticks: selected_symbol,
          subscribe: 1,
        })
      );
    }
  }, [selected_symbol]);
  return (
    <div className="market">
      <div className="market--container">
        <ExpenseConnection />
        <div className="market--container__price">
          {price === 0 ? <h3>Select Markets and Assets</h3> : <h3>{price}</h3>}
        </div>
        <div className="market--container__content">
          <select
            onChange={(e) => {
              if (e.target.value) {
                setAssetList(active_symbols.filter((a) => a.market === e.target.value));
              }
            }}
          >
            <option value="">Select a market</option>
            {markets_list.map((m) => {
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
            {asset_list.map((a) => {
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
          <button className="transparent" onClick={() => setBasis("stake")}>
            Stake
          </button>
          <button className="transparent" onClick={() => setBasis("payout")}>
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
        </div>
        <div className="market--container__btn">
          <button className="buy market--container__btn--buy" onClick={expense_store.buyContract}>
            Buy
          </button>
          <button className="market--container__btn--sell" onClick={expense_store.sellContract}>
            Sell
          </button>
        </div>
      </div>
    </div>
  );
}
