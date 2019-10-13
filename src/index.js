import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from './redux/index'
// import { createStore } from 'redux'
import './index.css';
import Counter from './App';
import * as serviceWorker from './serviceWorker';

const defaultState = 0
const reducer = function(state=defaultState, action){
  switch(action.type){
    case 'INCREMENT': {
      return state + action.payload
    }
    case 'DECREMENT': {
      return state - action.payload
    }
    default: {
      return state
    }
  }
}
const store = createStore(reducer)
console.log('store.getState()',store.getState())
const render = () => {
  ReactDOM.render(
    <Counter
      value={store.getState()}
      onIncrement={() => store.dispatch({ type: 'INCREMENT', payload: 1 })}
      onDecrement={() => store.dispatch({ type: 'DECREMENT', payload: 1 })}/>, document.getElementById('root')
  );
}

store.subscribe(render)
render()

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
