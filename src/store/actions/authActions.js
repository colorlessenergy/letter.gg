export const loginAction = (credentials) => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();

    firebase.auth().signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    )
    .then(() => {
      dispatch({ type: 'LOGIN_SUCCESS' });
    })
    .catch((err) => {
      dispatch({ type: 'LOGIN_ERROR', err });
    })
  }
};

export const reauthenticateUser = (reauthUser) => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();

    let user = firebase.auth().currentUser;

    // have to create the credential object
    // https://github.com/angular/angularfire2/issues/491
    const credential = firebase.auth.EmailAuthProvider.credential(reauthUser.email, reauthUser.password);

    user.reauthenticateWithCredential(credential)
      .then(() => {
        dispatch({ type: 'REAUTHENTICATE_SUCCESS' });
      })
      .catch((err) => {
        dispatch({ type: 'REAUTHENTICATE_ERROR', err });
      });

  }
};

/**
 * when user updates their account information 
 * certain variables need to be reseted
 * so they can update their account information again 
 * later
 * 
 * @return {function} - to delay dispatch
 */

export const resetStateForUpdateUserAction = () => {
  return (dispatch) => {
    dispatch({ type: 'RESET_STATE_UPDATED_USER' })
  }
};

export const updateUserEmailAction = (updateUser) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();

    firebase.auth().currentUser.updateEmail(updateUser.email)
      .then(() => {
        console.log('update email');
        dispatch({ type: 'UPDATE_USER_SUCCESS' });
      })
      .catch((err) => {
        console.log(err, 'update email');
        dispatch({ type: 'UPDATE_USER_ERROR', err });
      });
  }
};

export const updateUserPasswordAction = (updateUser) => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();

    // only update password if it exist
    if (updateUser.password) {
      firebase.auth().currentUser.updatePassword(updateUser.password)
        .then(() => {
          console.log('update password');
          dispatch({ type: 'UPDATE_USER_SUCCESS' });
        })
        .catch((err) => {
          console.log(err, 'update password')
          dispatch({ type: 'UPDATE_USER_ERROR', err })
        });
    }

  }
};

export const updateUserUsernameAction = (updateUser) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();

    // only update username if it exist
    let userCollection = firestore.collection('users').doc(updateUser.UID);
    if (updateUser.username) {
      userCollection.update({
        username: updateUser.username
      })
      .then(() => {
        console.log('update username');
        dispatch({ type: 'UPDATE_USER_SUCCESS' });
      })
      .catch((err) => {
        console.log('update username ', err)
        dispatch({ type: 'UPDATE_USER_ERROR', err })
      });
    }
  }
};

export const logOut = () => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();

    firebase.auth().signOut()
      .then(() => {
        dispatch({ type: 'LOGOUT_SUCCESS' });
      })
  }
};

export const registerAction = (newUser) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    // when creating a document in firebase auth
    // create a document in firestore for users
    //  so we can store more data about the user
    // the id is the same for both
    firebase.auth().createUserWithEmailAndPassword(
      newUser.email,
      newUser.password
    ).then((res) => {
      return firestore.collection('users').doc(res.user.uid).set({
        username: newUser.username
      })
    })
    .then(() => {
      dispatch({ type: 'REGISTER_SUCCESS' });
    })
    .catch((err) => {
      dispatch({ type: 'REGISTER_ERROR', err });
    })

    console.log(newUser, 'Register Action');
  }
};