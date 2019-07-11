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
  
    case 'EDIT_BUILD_SUCCESS':
      console.log('successfully edited the build');
      return {
        ...state,
        authError: null
      }
    
    case 'EDIT_BUILD_ERROR':
      console.log('error editing the build', action.err);
      return {
        ...state,
        authError: null
      }

    case 'UPVOTE_BUILD_SUCCESS':
      console.log('upvote build success');
      return {
        ...state,
        authError: null
      }
    
    case 'UPVOTE_BUILD_ERROR':
      console.log('upvote error', action.err);
      return {
        ...state,
        authError: action.err
      }


    default:
      return state
  }
}

export default buildReducer;