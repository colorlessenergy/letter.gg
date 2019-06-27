export const createBuildAction = (build) => {
  return (dispatch, getState) => {
    console.log('creating build')
    dispatch({ type: 'CREATE_BUILD', build: build })
  }
}

export const getBuildsAction = () => {
  return (dispatch, getState) => {
    console.log('fetching build');
    
    dispatch({ type: 'GET_BUILDS' })
  }
}