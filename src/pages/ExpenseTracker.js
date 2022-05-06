import React from 'react'
import ExpenseBalance from '../components/ExpenseBalance/ExpenseBalance';
import ExpenseConnection from '../components/ExpenseButtonConnection/ExpenseConnection';
import ExpenseLocation from '../components/ExpenseLocation/ExpenseLocation';

function ExpenseTracker() {
    return (
      <>
        <ExpenseBalance/>
        <ExpenseConnection/>
        <ExpenseLocation/>
      </>
    );
}

export default ExpenseTracker