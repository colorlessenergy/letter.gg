export const loginAction = (credentials) => {
  return (dispatch, getState) => {
    // db stuff because it is async
    console.log(credentials, 'IN THE ACTION')
    dispatch({ type: 'LOGIN_SUCCESS' });
    // dispatch({ type: 'LOGIN_ERROR' });
  }
}

export const registerAction = (credentials) => {
  return (dispatch, getState) => {
    // db stuff

    console.log(credentials, 'Register Action');
    dispatch({ type: 'REGISTER_SUCCESS' });
    // dispatch({ type: 'REGISTER_ERROR' });
  }
}