import React from 'react'
import "./Expense.scss"

function Expense(props) {
  return (
    <div className='list--expenses--container'>
        <div className='list--expenses--container__items'>
            <h1  style={{color:props.color}}>{props.gain_loss}</h1>
            <h1 style={{color:props.color}}>{props.expense}</h1>
        </div>
        <hr className='list--expenses--container__divider'/>
    </div>
  )
}

export default Expense