import { combineReducers } from 'redux';

import authReducer from './authReducer';
import buildsReducer from './buildsReducer';

// help syncing firestore data with state 
import { firestoreReducer } from 'redux-firestore';

// to sync firebase information
import { firebaseReducer } from 'react-redux-firebase';

const rootReducer = combineReducers({
  auth: authReducer,
  builds: buildsReducer,
  firestore: firestoreReducer,
  // sync auth status
  firebase: firebaseReducer
})

export default rootReducer