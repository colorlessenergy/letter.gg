import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import rootReducer from './store/reducers/rootReducer';

// to access firebase and firestore api inside the action
// reduxFirestore, reactReduxFirebase enhances the store 
import { reduxFirestore, getFirestore } from 'redux-firestore';
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase';
import fbConfig from './config/fbConfig';

// pass reducer
const store = createStore(rootReducer, 
  compose(
  applyMiddleware(thunk.withExtraArgument({getFirebase,getFirestore})
  ),
  reduxFirestore(fbConfig),
  // insufficient permission error when user signs out
  // don't worry about it.
  // https://github.com/prescottprue/react-redux-firebase/issues/494 
  reactReduxFirebase(fbConfig, { useFirestoreForProfile: true, userProfile: 'users', attachAuthIsReady: true })
));

// waits until firebase auth and react knows if the user
// is login
store.firebaseAuthIsReady.then(() => {
  const app = (
    <Provider store={store}>
      <App />
    </Provider>
  )
  ReactDOM.render(app, document.getElementById('root'));
  
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();


