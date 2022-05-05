import React from 'react'
import { useObserver } from 'mobx-react'
import Expense from '../Expense/Expense'
import "./ExpenseLocation.scss"

const ExpenseLocation = (props) => {
    const store = React.useContext(props.expenseContext)
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

export default ExpenseLocation