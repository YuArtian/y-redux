const randomString = () => Math.random().toString(36).substring(7).split('').join('.')
const ActionTypes = {
  INIT: `@@y-redux/INIT${randomString()}`,
  REPLACE: `@@y-redux/REPLACE${randomString()}`,
  UNKNOWN_ACTION: () => `@@y-redux/UNKNOWN_ACTION${randomString()}`
}

export default ActionTypes