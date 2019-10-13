
import isPlainObject from './utils/isPlainObject'
import ActionTypes from './utils/actionTypes'

const createStore = function(reducer, preloadedState){
  if (typeof reducer !== 'function') {
    throw new Error('reducer 必须是函数')
  }
  let currentReducer = reducer
  let currentState = preloadedState
  let listenerQueue = []
  let isDispatching = false

  function getState(){
    if (isDispatching) {
      throw new Error('error! is dipatching')
    }
    return currentState
  }

  function dispatch(action){
    if (isPlainObject(!action)) {
      throw new Error('action 必须是一个简单对象')
    }
    if (typeof action.type === 'undefined') {
      throw new Error('action 中必须要有type属性')
    }
    if (isDispatching) {
      throw new Error('Reducers 正在进行dispatch')
    }
    try {
      isDispatching = true
      currentState = currentReducer(currentState, action)
    } finally {
      isDispatching = false
    }
    const listeners = listenerQueue
    for(let i = 0; i<listeners.length; i++){
      let listener = listeners[i]
      listener()
    }
    return action
  }

  function subscribe(listener){
    if (typeof listener !== 'function') {
      throw new Error('listener 必须是一个函数')
    }
    if (isDispatching) {
      throw new Error('Reducers 正在 dispatching')
    }
    let isSubscribed = true
    listenerQueue.push(listener)
    return function unsubscribe() {
      if (!isSubscribed) {
        return
      }
      if (isDispatching) {
        throw new Error('不能在dispatching中解绑')
      }
      isSubscribed = false
      const index = listenerQueue.indexOf(listener)
      listenerQueue.splice(index, 1)
    }
  }

  function replaceReducer(nextReducer){
    if (typeof nextReducer !== 'function') {
      throw new Error('nextReducer必须是函数')
    }
    currentReducer = nextReducer
    dispatch({ type: ActionTypes.REPLACE })
  }

  dispatch({ type: ActionTypes.INIT })
  return {
    getState,
    dispatch,
    subscribe,
    replaceReducer,
  }
}

export default createStore