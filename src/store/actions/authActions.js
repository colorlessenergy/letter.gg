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
}

export const logOut = () => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();

    firebase.auth().signOut()
      .then(() => {
        dispatch({ type: 'LOGOUT_SUCCESS' });
      })
  }
}

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
}