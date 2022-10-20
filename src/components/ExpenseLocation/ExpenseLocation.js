import React from 'react'
import { observer } from 'mobx-react'
import { useStore } from '../../store/ExepnseStore'
import Expense from '../Expense/Expense'
import "./ExpenseLocation.scss"

const ExpenseLocation = () => {
    const expenseStore  = useStore()
    const { profile, synth_count, frx_count, com_count, crypt_count, stock_count, basket_count } = expenseStore

    const [synthIsOpen, setSynthIsOpen] = React.useState(true)
    const [frxIsOpen, setFrxIsOpen] = React.useState(true)
    const [comIsOpen, setComIsOpen] = React.useState(true)
    const [cryptIsOpen, setCryptIsOpen] = React.useState(true)
    const [sindIsOpen, setSindIsOpen] = React.useState(true)
    const [bindIsOpen, setBindIsOpen] = React.useState(true)
    
    return ( 
      <>
        <p className='expenses--title'>EXPENSES</p>
        <button onClick={expenseStore.buyContract}>Buy</button>
        <button onClick={expenseStore.sellContract}>Sell</button>
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
                {synth_count}
              </div>
            </div>
  
            { synthIsOpen ? 
              (
                <div className='expenses--container__synth--content'>
                  {
                    profile.expense_item.map(
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
                {frx_count}
              </div>
            </div>
  
            {frxIsOpen ? 
              (
                <div className='expenses--container__frx--content'>
                  {
                    profile.expense_item.map(
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
                {com_count}
              </div>
            </div>
  
            {comIsOpen ? 
              (
                <div className='expenses--container__com--content'>
                  {
                    profile.expense_item.map(
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
                {crypt_count}
              </div>
            </div>
  
            {cryptIsOpen ? 
              (
                <div className='expenses--container__crypt--content'>
                  {
                    profile.expense_item.map(
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
                {stock_count}
              </div>
            </div>
  
            { sindIsOpen ? 
              (
                <div className='expenses--container__sind--content'>
                  {
                    profile.expense_item.map(
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
                {basket_count}
              </div>
            </div>
  
            {bindIsOpen ? 
              (
                <div className='expenses--container__bind--content'>
                  {
                    profile.expense_item.map(
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
  }

export default observer(ExpenseLocation)