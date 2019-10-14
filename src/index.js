import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware} from './redux/index'
// import { createStore, applyMiddleware } from 'redux'
import './index.css';
import Counter from './App';
import * as serviceWorker from './serviceWorker';

//reducers
const reducer = function(state=0, action){
  switch(action.type){
    case 'INCREMENT': {
      console.log('INCREMENT');
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

//logger中间件
const logger = store => {
  // store.dispatch({type: 'test'})
  return next => action => {
    console.log('logger ----> action',action);
    const result = next(action)
    console.log('logger <----- state', store.getState());
    return result
  }
}
const logger2 = store => next => action => {
  // store.dispatch({type: 'test'})
  console.log('logger222 ----> action',action);
  const result = next(action)
  // store.dispatch({type: 'test'})
  console.log('logger222 <----- state', store.getState());
  return result
}

const store = createStore(reducer, applyMiddleware(logger, logger2))
const render = () => {
  console.log('store.dispatch',store.dispatch);
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
