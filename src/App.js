import React from 'react'
import './App.scss'
import { useLocalStore, useObserver } from 'mobx-react';
import Expense from './components/Expense';

const ExpenseContext = React.createContext();
const ExpenseProvider = ({children}) => {
  const reference = React.useRef(null)
  
  const expenses = useLocalStore(()=>({
    connected: false,
    isLoading: false,
    profile:{
      total_balance: 0,
      token: {
        authorize:'',
      },
      expense_item: []
    },

    get_statement: false,
    all_statement: [],

    calculate_balance: false,

    synth_count: 0,
    frx_count:0,
    com_count:0,
    crypt_count:0,
    stock_count:0,
    basket_count:0,

    getConnected: ()=>{
      if(expenses.profile.token.authorize.length !== 15){
        alert("Check Your Token again")
      }
      else{
        reference.current = new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089")
        expenses.isLoading = true
        if(expenses.connected === false){
          reference.current.onopen = function(evt){
            reference.current.send(JSON.stringify(expenses.profile.token));

            reference.current.onmessage = function(msg){
              var data = JSON.parse(msg.data)
              
              if(data.msg_type === "authorize"){
                if(data.error === undefined){
                  reference.current.send(JSON.stringify({
                    balance:1,
                    subscribe:1
                  }))
                  expenses.isLoading = false
                  expenses.connected = true
                }
                else{
                  alert(data.error.code)
                  expenses.isLoading = false
                  expenses.connected = false
                }
              }
              else if(data.msg_type === "balance"){
                expenses.profile.total_balance = data.balance.balance
      
                expenses.get_statement ? reference.current.send(JSON.stringify({
                  statement: 1,
                  description: 1,
                  limit: 5,
                  offset: 0
                })) : expenses.get_statement = true
              }
              else if(data.msg_type === "statement"){
                expenses.all_statement.push(
                  {
                    "contract_id": data.statement.transactions[0].contract_id,
                    "amount" : data.statement.transactions[0].amount,
                    "trade_item" : data.statement.transactions[0].shortcode
                  }
                )
                
                let expenses_info = []
                let valueArr = []

                valueArr = expenses.all_statement.map(function(item){return item.contract_id})
                const toFindDuplicates = arry => arry.filter((item, index) => arry.indexOf(item) !== index)
                const duplicateElements = toFindDuplicates(valueArr);

                let count_synth = 0
                let count_frx = 0
                let count_com = 0
                let count_crypt = 0
                let count_sind = 0
                let count_bind = 0
      
                duplicateElements.forEach(
                  (item) => {
                    let calculate_expense = 0
                    let trade_item = ""
                    let color = ""
                    let gainloss = ""
      
                    expenses.all_statement.forEach(
                      (thing) => {
                        if(thing.contract_id === item){
                          calculate_expense = calculate_expense + thing.amount
                          if(thing.trade_item.includes("FRXX")){
                            trade_item = "Commodities"
                          }else if(thing.trade_item.includes("OTC")){
                            trade_item = "Stock Indices"
                          }else if(thing.trade_item.includes("WLD")){
                            trade_item = "Basket Indices"
                          }else if(thing.trade_item.includes("1HZ")){
                            trade_item = "Synthetic Indices"
                          }else if(thing.trade_item.includes("CRY")){
                            trade_item = "Cryptocurrencies"
                          }else{
                            trade_item = "Forex"
                          }
                        }
                      }
                    )
      
                    if(calculate_expense < 0){
                      color="red"
                      gainloss = "LOSS"
                    }else if(calculate_expense > 0){
                      color="green"
                      gainloss = "GAIN"
                    }else{
                      color="black"
                      gainloss = "NULL"
                    }
      
                    if(trade_item === "Synthetic Indices"){
                      count_synth++
                      expenses.synth_count = count_synth
                    }else if(trade_item === "Commodities"){
                      count_com++
                      expenses.com_count = count_com
                    }else if(trade_item === "Stock Indices"){
                      count_sind++
                      expenses.stock_count = count_sind
                    }else if(trade_item === "Basket Indices"){
                      count_bind++
                      expenses.basket_count = count_bind
                    }else if(trade_item === "Cryptocurrencies"){
                      count_crypt++
                      expenses.crypt_count = count_crypt
                    }else{
                      count_frx++
                      expenses.frx_count = count_frx
                    }
      
                    expenses_info.push({
                      "expense": calculate_expense.toFixed(2),
                      "category": trade_item,
                      "color":color,
                      "gain_loss": gainloss
                    })
      
                    expenses.profile.expense_item = expenses_info
                  }
                )
              }

            }

          }
        }
        else{
            
          reference.current.onclose = function(msg){
            alert("Successfully Closed Websocket")
            expenses.isLoading = false
            expenses.connected = false
            expenses.profile.total_balance = 0
            expenses.profile.expense_item = []
            expenses.get_statement = false
            expenses.all_statement = []
            expenses.calculate_balance = false
            expenses.synth_count= 0
            expenses.frx_count=0
            expenses.com_count=0
            expenses.crypt_count=0
            expenses.stock_count=0
            expenses.basket_count=0
          }
          return reference.current.close()
        }
      }
    },
  }))

  return <ExpenseContext.Provider value={expenses}>{children}</ExpenseContext.Provider>
}

const ExpenseBalance = () => {
  const store = React.useContext(ExpenseContext)
  return useObserver( () => (
      <div className='balance--container'>
        <p>TOTAL BALANCE</p>
        <h1>$ {(Math.round(store.profile.total_balance * 100) / 100).toLocaleString()}</h1>
      </div>
    )
  )
}

const ExpenseConnection = () => {
  const store = React.useContext(ExpenseContext)
  return useObserver( ()=> (
    <div className='button--container'>
      <div className='button--container__buttons'>
        {
          (store.connected ? 
            (
              <div className='button--container__buttons'>
                <input 
                  className='button--container__buttons--textfield'
                  placeholder={store.profile.token.authorize}
                  disabled
                />
                <button onClick={store.getConnected} style={{backgroundColor:"red",color:"white"}}>
                  Disconnect
                </button>
              </div>
            ):
            (
              <div className='button--container__buttons'>
                <input 
                  className='button--container__buttons--textfield'
                  placeholder='Token'
                  onChange={
                    (e)=>{
                      store.profile.token.authorize = e.target.value
                    }
                  }
                />
                {(store.isLoading ? 
                  <button disabled>
                    Loading...
                  </button> : 
                  <button onClick={store.getConnected}>
                    Connect
                  </button>
                )}
              </div>
              // <button onClick={store.getConnected}>
              //   Connect
              // </button>
            )
          )
        }
      </div>
    </div>
  ))
}

const ExpenseLocation = () => {
  const store = React.useContext(ExpenseContext)
  const [synthIsOpen, setSynthIsOpen] = React.useState(true)
  const [frxIsOpen, setFrxIsOpen] = React.useState(true)
  const [comIsOpen, setComIsOpen] = React.useState(true)
  const [cryptIsOpen, setCryptIsOpen] = React.useState(true)
  const [sindIsOpen, setSindIsOpen] = React.useState(true)
  const [bindIsOpen, setBindIsOpen] = React.useState(true)
  
  return useObserver( () => (
    <>
      <p className='expenses--title'>EXPENSES</p>
      <div className='expenses--container'>

        <div className='expenses--container__synth'>
          <div 
            className='expenses--container__synth--header' 
            onClick={
              ()=>{
                setSynthIsOpen(!synthIsOpen)
              }
            }
          >
            <h1>SYNTHETIC INDICES</h1>
            <div className='expenses--container__synth--header__counter'>
              {store.synth_count}
            </div>
          </div>

          { synthIsOpen ? 
            (
              <div className='expenses--container__synth--content'>
                {
                  store.profile.expense_item.map(
                    (element,index) => (
                        element.category === "Synthetic Indices" ? 
                        (
                          <Expense
                            key={index}
                            color={element.color} 
                            gain_loss={element.gain_loss} 
                            expense={element.expense}
                          />
                        ) : null
                      )
                  )
                }
              </div>
            ) 
            : null
          }
        </div>

        <div className='expenses--container__frx'>
          <div 
            className='expenses--container__frx--header'
            onClick={
              ()=>{
                setFrxIsOpen(!frxIsOpen)
              }
            }
          >
            <h1>FOREX</h1>
            <div className='expenses--container__synth--header__counter'>
              {store.frx_count}
            </div>
          </div>

          {frxIsOpen ? 
            (
              <div className='expenses--container__frx--content'>
                {
                  store.profile.expense_item.map(
                    (element,index) => 
                      (
                        element.category === "Forex" ? 
                        (
                          <Expense 
                            key={index}
                            color={element.color} 
                            gain_loss={element.gain_loss} 
                            expense={element.expense}
                          />
                        ) : null
                      )
                    )
                }
              </div>
            ) : null}
        </div>

        <div className='expenses--container__com'>
          <div 
            className='expenses--container__com--header'
            onClick={
              ()=>{
                setComIsOpen(!comIsOpen)
              }
            }
          >
            <h1>COMMODITIES</h1>
            <div className='expenses--container__synth--header__counter'>
              {store.com_count}
            </div>
          </div>

          {comIsOpen ? 
            (
              <div className='expenses--container__com--content'>
                {
                  store.profile.expense_item.map(
                    (element,index) => 
                      (
                        element.category === "Commodities" ? 
                        (
                          <Expense 
                            key={index}
                            color={element.color} 
                            gain_loss={element.gain_loss} 
                            expense={element.expense}
                          />
                        ) : null
                      )
                    )
                }
              </div>
            ) : null}
        </div>

        <div className='expenses--container__crypt'>
          <div 
            className='expenses--container__crypt--header'
            onClick={
              ()=>{
                setCryptIsOpen(!cryptIsOpen)
              }
            }
          >
            <h1>CRYPTOCURRENCIES</h1>
            <div className='expenses--container__synth--header__counter'>
              {store.crypt_count}
            </div>
          </div>

          {cryptIsOpen ? 
            (
              <div className='expenses--container__crypt--content'>
                {
                  store.profile.expense_item.map(
                    (element,index) => 
                      (
                        element.category === "Cryptocurrencies" ? 
                        (
                          <Expense 
                            key={index}
                            color={element.color} 
                            gain_loss={element.gain_loss} 
                            expense={element.expense}
                          />
                        ) : null
                      )
                    )
                }
              </div>
            ) : null}
        </div>

        <div className='expenses--container__sind'>
          <div 
            className='expenses--container__sind--header'
            onClick={
              ()=>{
                setSindIsOpen(!sindIsOpen)
              }
            }
          >
            <h1>STOCK INDICES</h1>
            <div className='expenses--container__synth--header__counter'>
              {store.stock_count}
            </div>
          </div>

          { sindIsOpen ? 
            (
              <div className='expenses--container__sind--content'>
                {
                  store.profile.expense_item.map(
                    (element,index) => 
                      (
                        element.category === "Stock Indices" ? 
                        (
                          <Expense 
                            key={index}
                            color={element.color} 
                            gain_loss={element.gain_loss} 
                            expense={element.expense}
                          />
                        ) : null
                      )
                    )
                }
              </div>
            ) : null}
        </div>

        <div className='expenses--container__bind'>
          <div 
            className='expenses--container__bind--header'
            onClick={
              ()=>{
                setBindIsOpen(!bindIsOpen)
              }
            }
          >
            <h1>BASKET INDICES</h1>
            <div className='expenses--container__synth--header__counter'>
              {store.basket_count}
            </div>
          </div>

          {bindIsOpen ? 
            (
              <div className='expenses--container__bind--content'>
                {
                  store.profile.expense_item.map(
                    (element,index) => 
                      (
                        element.category === "Basket Indices" ? 
                        (
                          <Expense 
                            key={index}
                            color={element.color} 
                            gain_loss={element.gain_loss} 
                            expense={element.expense}
                          />
                        ) : null
                      )
                    )
                }
              </div>
            ) : null}
        </div>

      </div>
    </>
    )
  )
}

function App() {
  return (
    <ExpenseProvider>
      <ExpenseBalance />
      <ExpenseConnection />
      <ExpenseLocation />
    </ExpenseProvider>
  );
}

export default App;
