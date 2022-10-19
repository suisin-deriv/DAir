import React from 'react'
import ExpenseBalance from '../components/ExpenseBalance/ExpenseBalance';
import ExpenseConnection from '../components/ExpenseButtonConnection/ExpenseConnection';
import ExpenseLocation from '../components/ExpenseLocation/ExpenseLocation';
import Charts from '../components/Charts/Charts'

function ExpenseTracker() {
    return (
      <>
        <ExpenseBalance/>
        <Charts style={{alignItem:'center'}}/>
        <ExpenseConnection/>
        <ExpenseLocation/>
      </>
    );
}

export default ExpenseTracker