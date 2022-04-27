import React from 'react'
import './App.scss'
import { useLocalStore, useObserver } from 'mobx-react';
import Expense from './components/Expense';

const ExpenseContext = React.createContext();
const ExpenseProvider = ({children}) => {
  const reference = React.useRef(null)
  
  const expenses = useLocalStore(()=>({
    connected: false,
    profile:{
      total_balance: 0,
      token: {
        authorize:'xoNb6vA1zpQe7CY',
      },
      expense_item: []
    },

    get_statement: false,
    all_statement: [],

    calculate_balance: false,

    getConnected: ()=>{
      reference.current = new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089")
      if(expenses.connected === false){
        reference.current.onopen = function(evt){
          reference.current.send(JSON.stringify(expenses.profile.token));

          reference.current.onmessage = function(){
            expenses.connected = true
          }
        }
      }else{
        reference.current.close()
        reference.current.onclose = function(msg){
          console.log("Successfully Closed Websocket")
        }
        expenses.connected = false
        expenses.profile.total_balance = 0
        expenses.profile.expense_item = []
        expenses.get_statement = false
        expenses.all_statement = []
        expenses.calculate_balance = false
      }
    },

    sendRequest: ()=>{
      reference.current.send(JSON.stringify({
        balance:1,
        subscribe:1
      }))

      reference.current.onmessage = function(msg){
        var data = JSON.parse(msg.data)

        if(data.msg_type === "balance"){
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
          // console.log(expenses.all_statement);
          var valueArr = expenses.all_statement.map(function(item){return item.contract_id})
          const toFindDuplicates = arry => arry.filter((item, index) => arry.indexOf(item) !== index)
          const duplicateElements = toFindDuplicates(valueArr);
          // console.log(duplicateElements)
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

              expenses_info.push({
                "expense": calculate_expense.toFixed(2),
                "category": trade_item,
                "color":color,
                "gain_loss": gainloss
              })

              // console.log(expenses_info)

              expenses.profile.expense_item = expenses_info
            }
          )
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
              <button onClick={store.getConnected} style={{backgroundColor:"red",color:"white"}}>
                Disconnect
              </button>
            ):
            (
              <button onClick={store.getConnected}>
                Connect
              </button>
            )
          )
        }
        <button onClick={store.sendRequest}>
          Send
        </button>
      </div>
    </div>
  ))
}

const ExpenseLocation = () => {
  const store = React.useContext(ExpenseContext)
  
  return useObserver( () => (
    <>
      <p className='expenses--title'>Total Expenses</p>
      <div className='expenses--container'>

        <div className='expenses--container__synth'>
          <div className='expenses--container__synth--header'>
            <h1>SYNTHETIC INDICES</h1>
          </div>

          <div className='expenses--container__synth--content'>
            {
              store.profile.expense_item.map(
                (element,index) => 
                  (
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
        </div>

        <div className='expenses--container__frx'>
          <div className='expenses--container__frx--header'>
            <h1>FOREX</h1>
          </div>

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
        </div>

        <div className='expenses--container__com'>
          <div className='expenses--container__com--header'>
            <h1>COMMODITIES</h1>
          </div>

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
        </div>

        <div className='expenses--container__crypt'>
          <div className='expenses--container__crypt--header'>
            <h1>CRYPTOCURRENCIES</h1>
          </div>

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
        </div>

        <div className='expenses--container__sind'>
          <div className='expenses--container__sind--header'>
            <h1>STOCK INDICES</h1>
          </div>

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
        </div>

        <div className='expenses--container__bind'>
          <div className='expenses--container__bind--header'>
            <h1>BASKET INDICES</h1>
          </div>

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
