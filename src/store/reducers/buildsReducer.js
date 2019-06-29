const initState =  {
  builds: []
}

const buildReducer = (state=initState, action) => {
  switch (action.type) {
    case 'CREATE_BUILD':
      console.log('creating build in buildsReducer.js', action)
      return state;

    case 'CREATE_BUILD_ERROR':
      console.log('there was an error', action.err)
      return state;

    default:
      return state
  }

}

export default buildReducer;