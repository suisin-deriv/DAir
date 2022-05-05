import React from 'react'
import { useObserver } from 'mobx-react'
import "./ExpenseBalance.scss"

const ExpenseBalance = (props) => {
    const store = React.useContext(props.expenseContext)
    return useObserver( () => (
        <div className='balance--container'>
          <p>TOTAL BALANCE</p>
          <h1>$ {(Math.round(store.profile.total_balance * 100) / 100).toLocaleString()}</h1>
        </div>
      )
    )
  }

export default ExpenseBalance