import React from 'react'
import { observer } from 'mobx-react'
import { useStore } from '../../store/ExepnseStore'
import "./ExpenseConnection.scss"

const ExpenseConnection = () => {
    const expenseStore = useStore()
    const { getConnected, profile, connected, isLoading } = expenseStore

    return (
      <div className='button--container'>
        <div className='button--container__buttons'>
          {
            (connected ? 
              (
                <div className='button--container__buttons'>
                  <span className='button--container__buttons--login-id'>{profile.login_id}</span>
                  <button onClick={getConnected} style={{backgroundColor:"red",color:"white"}}>
                    Disconnect
                  </button>
                </div>
              ):
              (
                <div className='button--container__buttons'>
                  <input 
                    className='button--container__buttons--textfield'
                    placeholder='Token'
                    onChange={
                      (e)=>{
                        profile.token.authorize = e.target.value
                      }
                    }
                  />
                  {(isLoading ? 
                    <button disabled>
                      Loading...
                    </button> : 
                    <button onClick={getConnected}>
                      Connect
                    </button>
                  )}
                </div>
              )
            )
          }
        </div>
      </div>
    )
  }

export default observer(ExpenseConnection)