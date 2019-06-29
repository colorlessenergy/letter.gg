const initState = {
  authError: null
};

const authReducer = (state=initState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        authError: null
      }
    
    case 'LOGIN_ERROR':
      return {
        ...state,
        authError: action.err.message
      }
    
    case 'LOGOUT_SUCCESS':
      console.log('signout success');
      return state;
    
    case 'REGISTER_SUCCESS':
      console.log('register success')
      return {
        ...state,
        authError: null
      }

    case 'REGISTER_ERROR':
      console.log('register error')
      return {
        ...state,
        authError: action.err.message
      }

    default:
      return state
  }
}

export default authReducer;