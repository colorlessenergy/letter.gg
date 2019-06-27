const initState =  {
  builds: []
}

const buildReducer = (state=initState, action) => {
  switch (action.type) {
    case 'CREATE_BUILD':
      console.log('creating build in buildsReducer.js', action)
      return {
        ...state,
        builds: [...state.builds, action.build]
      }


    case 'GET_BUILDS':
      console.log('fetching builds in buildReducer.js', action);

      return {
        ...state,
        builds: [...state.builds]
      }
    default:
      return state
  }

}

export default buildReducer;