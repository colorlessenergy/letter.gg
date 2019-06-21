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
        authError: 'Login Failed'
      }
    
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        authError: null
      }

    case 'REGISTER_ERROR':
      return {
        ...state,
        authError: 'Register Failed'
      }

    default:
      return state
  }
}

export default authReducer;