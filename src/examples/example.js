import { useLocalStore} from 'mobx-react';

const ExpenseContext = React.createContext();

// Provider for MobX Content
const ExpenseProvider = ({children}) => {
  const reference = React.useRef(null)
  const expenses = useLocalStore(
      ()=>({
        connected: false,
        isLoading: false,
        profile:{
          login_id:'',
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
                      expenses.profile.login_id = data.authorize.loginid
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
                expenses.profile.token.authorize = ""
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
    })
  )

  return <ExpenseContext.Provider value={expenses}>{children}</ExpenseContext.Provider>
}