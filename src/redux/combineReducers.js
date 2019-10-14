import ActionTypes from './utils/actionTypes'

function assertReducerShape(reducers){
  Object.entries(reducers).forEach(([key, reducer]) => {
    const initialState = reducer(undefined, ActionTypes.INIT)
    if (typeof initialState === 'undefined') {
      throw new Error(`值为${key}的Reducer初始化时返回了 undefined; 你需要为reducer中的state设置初始值；也可以用null替代`)
    }
    if (typeof reducer(undefined, {type: ActionTypes.UNKNOWN_ACTION()}) === 'undefined') {
      throw new Error(`${key} Reducer需要为未知的action类型返回当前的state`)
    }
  })
}

export default function combineReducers(reducers){
  //筛选符合规范的reducer
  let finalReducers = {}
  Object.entries(reducers).forEach(([key, item]) => {
    if (typeof item === 'undefined') {
      throw new Error(`${key}没有对应的reducer`)
    }
    if (typeof item === 'function') {
      finalReducers[key] = item
    }
  })
  //对reducers进行输入输出校验
  let shapeReducerError
  try {
    assertReducerShape(finalReducers)
  } catch (error) {
    shapeReducerError = error
  }

  return function combination(state = {}, action){
    if (shapeReducerError) {
      throw shapeReducerError
    }
    let hasChanged = false
    let nextState = {}
    Object.entries(finalReducers).forEach(([key, reducer]) => {
      const preStateForKey = state[key]
      const nextStateForKey = reducer(preStateForKey, action)
      if (typeof nextStateForKey === 'undefined') {
        throw new Error(`${key}Reducer不能返回undefined`)
      }
      nextState[key] = nextStateForKey
      hasChanged = hasChanged || nextStateForKey !==  preStateForKey
    })
    return hasChanged ? nextState : state
  }
}