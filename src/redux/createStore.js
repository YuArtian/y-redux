
import isPlainObject from './utils/isPlainObject'
import ActionTypes from './utils/actionTypes'

export default function createStore(reducer, preloadedState, enhancer){
  if (
    (typeof preloadedState === 'function' && typeof enhancer === 'function') ||
    (typeof enhancer === 'function' && typeof arguments[3] === 'function')
  ) {
    throw new Error('不要传多个enhancer, 使用compose组合')
  }
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState
    preloadedState = undefined
  }
  if (typeof reducer !== 'function') {
    throw new Error('reducer必须是函数')
  }
  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('enhancer必须是函数')
    }
    return enhancer(createStore)(reducer, preloadedState)
  }
  let currenrReducer = reducer
  let currentState = preloadedState
  let isDispatching = false
  let listenerQueue = []

  function getState(){
    if (isDispatching) {
      throw new Error('正在dispatch,不能获取state')
    }
    return currentState
  }

  function replaceReducer(nextReducer){
    if (typeof nextReducer !== 'function') {
      throw new Error('reducer必须是函数')
    }
    currenrReducer = nextReducer
    dispatch({type: ActionTypes.REPLACE})
  }

  function dispatch(action){
    if (!isPlainObject(action)) {
      throw new Error('action 必须是简单对象')
    }
    if (typeof action.type === 'undefined') {
      throw new Error('action 必须有type属性')
    }
    if (isDispatching) {
      throw new Error('reducer 正在dispatch')
    }
    try {
      isDispatching = true
      currentState = currenrReducer(currentState, action)
    } finally {
      isDispatching = false
    }
    for(let i=0; i<listenerQueue.length; i++){
      const listener = listenerQueue[i]
      listener()
    }
    return action
  }

  function subscribe(listener){
    if (typeof listener !== 'function') {
      throw new Error('listener 必须是函数')
    }
    let isSubed = true
    listenerQueue.push(listener)
    return function unsubscribe(){
      if (!isSubed) {
        return
      }
      if (isDispatching) {
        throw new Error('正在dispatch不能解除监听')
      }
      isSubed = false
      const index = listenerQueue.indexOf(listener)
      listenerQueue.splice(index, 1)
    }
  }

  dispatch({type: ActionTypes.INIT})

  return {
    getState,
    dispatch,
    subscribe,
    replaceReducer
  }
}