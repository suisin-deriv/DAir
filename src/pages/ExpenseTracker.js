import React from 'react'
import ExpenseBalance from '../components/ExpenseBalance/ExpenseBalance';
import ExpenseConnection from '../components/ExpenseButtonConnection/ExpenseConnection';
import ExpenseLocation from '../components/ExpenseLocation/ExpenseLocation';
import Charts from '../components/Charts/Charts'
import '../style/style.scss'

function ExpenseTracker() {
    return (
      <div className='main-container'>
        <div className='header'>
        <ExpenseBalance/>
        </div>
        <div className='body'>
        <ExpenseConnection/>
        <Charts/>
        </div>
        <div className='footer'>
        <ExpenseLocation/>
        </div>
      </div>
    );
}

export default ExpenseTracker