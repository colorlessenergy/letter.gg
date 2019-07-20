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
      console.log('signout success');
      return state;
    
    case 'REGISTER_SUCCESS':
      console.log('register success')
      return {
        ...state,
        authError: null
      }

    case 'REGISTER_ERROR':
      console.log('register error', action)
      return {
        ...state,
        authError: action.err.message
      }


    case 'UPDATE_USER_ERROR':
      console.log('update user error', action.err, action.err.code === 'auth/user-token-expired');

      return {
        ...state,
        authError: action.err.message,
        userUpdated: false
      }
    
    case 'UPDATE_USER_SUCCESS':
      console.log('update user success');
      return {
        ...state,
        // this will be used to redirect the user
        userUpdated: true,
        // reset the state of reauthenticateSuccess
        reauthenticateSuccess: false
      }

    case 'REAUTHENTICATE_SUCCESS':
      console.log('reauthenticate success');

      return {
        ...state,
        reauthenticateSuccess: true,
        authError: null
      }

    case 'REAUTHENTICATE_ERROR':
      console.log('reauthenticate ERROR', action.err);

      return {
        ...state,
        reauthenticateSuccess: false,
        authError: action.err.message
      }

    case 'DELETE_SUCCESS':
      console.log('delete user successfully');

      return {
        ...state,
        authError: null,
        accountIsDeleted: true,
        // reset the state of reauthenticateSuccess
        reauthenticateSuccess: false
      };

    case 'DELETE_ERROR':
      console.log('delete user error', action.err);
      
      return {
        ...state,
        accountIsDeleted: false,
        authError: action.err
      }

    
    // reset the state of the user so 
    // when they try to change some other senstive data
    // it will make them reauthenticate
    case 'RESET_STATE_UPDATED_USER':
      console.log('RESETING state');
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