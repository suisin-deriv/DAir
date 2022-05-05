import React from 'react'
import { useObserver } from 'mobx-react'
import "./ExpenseConnection.scss"

const ExpenseConnection = (props) => {
    const store = React.useContext(props.expenseContext)
    return useObserver( ()=> (
      <div className='button--container'>
        <div className='button--container__buttons'>
          {
            (store.connected ? 
              (
                <div className='button--container__buttons'>
                  <span className='button--container__buttons--login-id'>{store.profile.login_id}</span>
                  <button onClick={store.getConnected} style={{backgroundColor:"red",color:"white"}}>
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
                        store.profile.token.authorize = e.target.value
                      }
                    }
                  />
                  {(store.isLoading ? 
                    <button disabled>
                      Loading...
                    </button> : 
                    <button onClick={store.getConnected}>
                      Connect
                    </button>
                  )}
                </div>
              )
            )
          }
        </div>
      </div>
    ))
  }

export default ExpenseConnection