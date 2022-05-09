import React from 'react'
import ExpenseBalance from '../components/ExpenseBalance/ExpenseBalance';
import ExpenseConnection from '../components/ExpenseButtonConnection/ExpenseConnection';
import ExpenseLocation from '../components/ExpenseLocation/ExpenseLocation';

function ExpenseTracker() {
    return (
      <>
        <h1>Hi</h1>
        <ExpenseBalance/>
        <ExpenseConnection/>
        <ExpenseLocation/>
      </>
    );
}

export default ExpenseTracker