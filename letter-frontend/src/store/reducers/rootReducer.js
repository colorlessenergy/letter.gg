import { combineReducers } from 'redux';

import authReducer from './authReducer';
import buildsReducer from './buildsReducer';

// help syncing firestore data with state 
import { firestoreReducer } from 'redux-firestore';

const rootReducer = combineReducers({
  auth: authReducer,
  builds: buildsReducer,
  firestore: firestoreReducer
})

export default rootReducer