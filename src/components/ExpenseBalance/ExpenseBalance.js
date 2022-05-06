import React from 'react'
import { observer } from 'mobx-react'
import { useStore } from '../../store/ExepnseStore'
import "./ExpenseBalance.scss"

const ExpenseBalance = () => {
    const expenseStore = useStore()
    const { profile } = expenseStore
    
    return ( 
        <div className='balance--container'>
          <p>TOTAL BALANCE</p>
          <h1>$ {(Math.round(profile.total_balance * 100) / 100).toLocaleString()}</h1>
        </div>
    )
  }

export default observer(ExpenseBalance)