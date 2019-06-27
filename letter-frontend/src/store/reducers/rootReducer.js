import { combineReducers } from 'redux';
import authReducer from './authReducer';
import buildsReducer from './buildsReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  builds: buildsReducer
})

export default rootReducer