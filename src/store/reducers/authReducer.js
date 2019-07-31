const initState = {
  authError: null,
  userUpdate: false,
  reauthenticateSuccess: false
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
      return state;
    
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        authError: null
      }

    case 'REGISTER_ERROR':
      return {
        ...state,
        authError: action.err.message
      }


    case 'UPDATE_USER_ERROR':
      return {
        ...state,
        authError: action.err.message,
        userUpdated: false
      }
    
    case 'UPDATE_USER_SUCCESS':
      return {
        ...state,
        // this will be used to redirect the user
        userUpdated: true,
        // reset the state of reauthenticateSuccess
        reauthenticateSuccess: false
      }

    case 'REAUTHENTICATE_SUCCESS':
      return {
        ...state,
        reauthenticateSuccess: true,
        authError: null
      }

    case 'REAUTHENTICATE_ERROR':
      return {
        ...state,
        reauthenticateSuccess: false,
        authError: action.err.message
      }

    case 'DELETE_SUCCESS':
      return {
        ...state,
        authError: null,
        accountIsDeleted: true,
        // reset the state of reauthenticateSuccess
        reauthenticateSuccess: false
      };

    case 'DELETE_ERROR':      
      return {
        ...state,
        accountIsDeleted: false,
        authError: action.err
      }

    
    // reset the state of the user so 
    // when they try to change some other senstive data
    // it will make them reauthenticate
    case 'RESET_STATE_UPDATED_USER':
      return {
        ...state,
        reauthenticateSuccess: false,
        authError: null,
        userUpdated: false
      }

    default:
      return state
  }
}

export default authReducer;