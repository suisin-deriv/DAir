import { action, decorate, observable } from "mobx";
import React from "react";

export default class ExpenseStore {
    reference = React.useRef(null)
    connected = false;
    isLoading = false;
    get_statement = false;
    all_statement = [];
    calculate_balance = false;
    synth_count = 0;
    frx_count = 0;
    com_count = 0;
    crypt_count = 0;
    stock_count = 0;
    basket_count = 0;
    profile = { login_id: '', total_balance: 0, token: {authorize: ''}, expense_item:[]};

    getConnected(){
        this.profile.token.authorize.length !== 15 ? 

        this.ErrorMessage() 
        : 
        this.ReadyToConnect()
    }

    ErrorMessage(){
        alert("Check Your Token Again")
    }

    ReadyToConnect(){
        this.ConnectWS()

        this.connected ? this.Disconnect() : this.Connect()
    }

    ConnectWS(){
        this.reference.current = new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089")
        this.isLoading = true
    }

    Connect(){
        this.reference.current.onopen = (msg)=>{
            this.SendAuthorizeRequest()
        }
    }

    SendAuthorizeRequest(){
        this.reference.current.send(JSON.stringify(this.profile.token))

        this.reference.current.onmessage = (msg)=>{
            let data = JSON.parse(msg.data)

            this.SwitchStatement(data)
        }
    }

    SwitchStatement(data){
        switch(data.msg_type){
            case "authorize":
                if(data.error === undefined){
                    this.profile.login_id = data.authorize.loginid
                    this.reference.current.send(JSON.stringify(
                        {
                            balance: 1,
                            subscribe: 1
                        }
                    ))
                    this.isLoading = false
                    this.connected = true
                }else{
                    alert(data.error.code)
                    this.isLoading = false
                    this.connected = false
                }

                break;
            
            case "balance":
                this.profile.total_balance = data.balance.balance
                this.get_statement ? this.reference.current.send(JSON.stringify(
                    {
                        statement: 1,
                        description: 1,
                        limit: 5,
                        offset: 0
                    }
                ))
                :
                this.get_statement = true

                break;

            case "statement":
                this.all_statement.push(
                    {
                        "contract_id": data.statement.transactions[0].contract_id,
                        "amount" : data.statement.transactions[0].amount,
                        "trade_item" : data.statement.transactions[0].shortcode
                    }
                )

                this.CalculateExpense()
                break;

            default:
                break;
        }
    }

    CalculateExpense(){
        let expenses_info = []
        let valueArr = []

        valueArr = this.all_statement.map(function(item){return item.contract_id})
        const toFindDuplicates = arry => arry.filter((item,index) => arry.indexOf(item) !== index)
        const duplicateElements = toFindDuplicates(valueArr)

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

                this.all_statement.forEach(
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
                    color = "red"
                    gainloss = "LOSS"
                }else if(calculate_expense > 0){
                    color="green"
                    gainloss = "GAIN"
                }else{
                    color="black"
                    gainloss = "NULL"
                }

                switch(trade_item){
                    case "Synthetic Indices":
                        count_synth++
                        this.synth_count = count_synth
                        break;
                    case "Commodities":
                        count_com++
                        this.com_count = count_com
                        break;
                    case "Stock Indices":
                        count_sind++
                        this.stock_count = count_sind
                        break;
                    case "Basket Indices":
                        count_bind++
                        this.basket_count = count_bind
                        break;
                    case "Cryptocurrencies":
                        count_crypt++
                        this.crypt_count = count_crypt
                        break;
                    default:
                        count_frx++
                        this.frx_count = count_frx
                        break;
                }

                expenses_info.push({
                    "expense": calculate_expense.toFixed(2),
                    "category": trade_item,
                    "color":color,
                    "gain_loss": gainloss
                })

                this.profile.expense_item = expenses_info
            }
        )
    }

    Disconnect(){
        this.reference.current.onclose = (msg)=>{
            this.isLoading = false
            this.connected = false
            this.profile.total_balance = 0
            this.profile.expense_item = []
            this.profile.token.authorize = ""
            this.get_statement = false
            this.all_statement = []
            this.calculate_balance = false
            this.synth_count= 0
            this.frx_count=0
            this.com_count=0
            this.crypt_count=0
            this.stock_count=0
            this.basket_count=0
        }
        return this.reference.current.close()
    }
}

decorate(ExpenseStore,{
    connected: observable,
    isLoading: observable,
    get_statement:observable,
    all_statement: observable,
    calculate_balance: observable,
    synth_count: observable,
    frx_count:observable,
    com_count:observable,
    crypt_count:observable,
    stock_count:observable,
    basket_count:observable,
    profile:observable,
    getConnected: action.bound
})

let store_context;

export const useStore = () =>{
    if(!store_context){
        const expenseStore = new ExpenseStore()

        store_context = React.createContext(expenseStore)
    }

    return React.useContext(store_context)
}