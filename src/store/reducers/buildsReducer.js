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

    case 'CREATE_COMMENT_SUCCESS':
      console.log('created comment', action)
      return state;

    case 'CREATE_COMMENT_ERROR':
      console.log('there was an error', action.err)
      return state;

    case 'CREATE_REPLY_SUCCESS':
      console.log('created REPLY', action)
      return state;

    case 'CREATE_REPLY_ERROR':
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

    case 'DELETE_BUILD_SUCCESS':
      console.log('successfully delete the build');
      return state;

    case 'DELETE_BUILD_ERROR':
      console.log('delete build err', action.err);
      return state;

    case 'DELETE_COMMENT_SUCCESS':
      console.log('successfully delete the comment');
      return state;

    case 'DELETE_COMMENT_ERROR':
      console.log('delete comment err', action.err);
      return state;

    case 'DELETE_REPLY_SUCCESS':
      console.log('successfully delete the reply');
      return state;

    case 'DELETE_REPLY_ERROR':
      console.log('delete reply err', action.err);
      return state;

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