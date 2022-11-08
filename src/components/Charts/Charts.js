import React from "react";
import { useStore } from "../../store/ExepnseStore";
import "./Chart.scss";

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
      <div className="message">
        <span>Select a market and symbol to view price.</span>
      </div>
      <div className="market--container">
        <select
          className="market--container__select"
          onChange={(e) => {
            if (e.target.value) {
              setAssetList(active_symbols.filter((a) => a.market === e.target.value));
            }
          }}
        >
          <option className="market--container__select--option" value="">
            Select a market
          </option>
          {markets_list.map((m) => {
            return (
              <option className="market--container__select--option" key={m.id} value={m.id}>
                {m.display_name}
              </option>
            );
          })}
        </select>
        <select
          className="market--container__select"
          onChange={(e) => {
            if (e.target.value) {
              setSelectedSymbol(e.target.value);
              setSymbol(e.target.value);
            }
          }}
        >
          <option className="market--container__select--option" value="">
            Select an asset
          </option>
          {asset_list.map((a) => {
            return (
              <option className="market--container__select--option" key={a.symbol} value={a.symbol}>
                {a.display_name}
              </option>
            );
          })}
        </select>
      </div>
      <div className="price">
        <span style={{ color }}>{price}</span>
      </div>

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
      <input
        type="number"
        value={buy_settings.buy_price}
        onChange={(e) => {
          setBuyPrice(Number(e.target.value));
        }}
      />
    </div>
  );
}
