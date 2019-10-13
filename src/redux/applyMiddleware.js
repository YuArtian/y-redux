import compose from './compose'

export default function applyMiddleware(...middlewares){
  return createStore => (...args) => {
    const store = createStore(...args)
    let dispatch = () => {
      throw new Error('构建middleware的时候不能dispatch')
    }
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }

    const chain = middlewares.map(middleware => middleware(middlewareAPI))
    console.log('chain!', chain);
    dispatch = compose(...chain)(store.dispatch)
    return {
      ...store,
      dispatch
    }
  }
}