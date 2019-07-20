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

/**
 * update user username
 * to create uniquness a collection for usernames was created
 * this collection is used to check if the username exists
 * by querying for the doc by username
 * using this information it will error to the user if the
 * username exist 
 * 
 * if it doesn't already exist it will delete the original username and create
 * a new doc with the new username set as the doc id
 * 
 * @param {Object} updateUser - a object with meta data about the updateed user
 * @param {String} updateUser.username - the new username
 * @param {String} updatedUser.UID - the uid of the document to update user
 */

export const updateUserUsernameAction = (updateUser) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const profileUser = getState().firebase.profile;


    if (updateUser.username) {
      let usernameCollection = firestore.collection('usernames');
      // check if the username exists in the collection
      // if it does throw an error and tell them to use a different username
      usernameCollection.doc(updateUser.username)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return dispatch({ type: 'UPDATE_USER_ERROR', err: { message: 'username already exist choose something else' } })
        }

        let userCollection = firestore.collection('users').doc(updateUser.UID);
        return userCollection.update({
          username: updateUser.username
        })
        .then(() => {
          return usernameCollection.doc(profileUser.username)
            .delete();
          })
          .then(() => {
            return usernameCollection.doc(updateUser.username)
            .set({
              a: 'a'
            })
            .then(() => {
              dispatch({ type: 'UPDATE_USER_SUCCESS' });
            })
          })
          .catch((err) => {
            dispatch({ type: 'UPDATE_USER_ERROR', err })
          });
      })
      .catch((err) => {
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

/**
 * delete all the content the user created
 * this includes replies, comments, builds, and post they liked
 * 
 * The upvote count will not be changed beecause the user
 * must of liked it and i want to keep that their so it
 * can help other people who are looking for builds
 * 
 */

export const DeleteUserAction = () => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // delete all the users build, comments and replies
    const firestore = getFirestore();
    const userId = getState().firebase.auth.uid;

    firestore
    .collection('builds')
    .get()
    .then((querySnapshot) => {      

      querySnapshot.forEach((doc) => {
        firestore
          .collection('builds')
          .doc(doc.id)
          .update({
            usersLikedBuild: firestore.FieldValue.arrayRemove(userId)
          });
          
      });

      // delete all the user builds in firestore
      return firestore
        .collection('builds')
        .where('authorId', '==', userId)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            firestore
              .collection('builds')
              .doc(doc.id)
              .delete()
              .catch(err => dispatch({ type: 'DELETE_ERROR', err }));
          });

        });
      })

      // delete all the user comments
      .then(() => {
        return firestore
          .collection('comments')
          .where('authorId', '==', userId)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              firestore
                .collection('comments')
                .doc(doc.id)
                .delete()
                .catch(err => dispatch({ type: 'DELETE_ERROR', err }));
            })
          })
      })

      .then(() => {
        //  delete all the usre replies
        return firestore
          .collection('replies')
          .where('authorId', '==', userId)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              firestore
                .collection('replies')
                .doc(doc.id)
                .delete()
                .catch(err => dispatch({ type: 'DELETE_ERROR', err }))
            })
          });
      })
      .then(() => {
        let usernameCollection = firestore.collection('usernames');
        const profile = getState().firebase.profile;
        // delete the user from the username collection
        // to free up that username
        return usernameCollection
          .doc(profile.username)
          .delete()
          .catch(err => { console.log(err) })
      })
      .then(() => {
        let usersCollection = firestore.collection('users');
        return usersCollection
          .doc(userId)
          .delete()
          .catch(err => { console.log(err) })
      })
      .then(() => {
        const firebase = getFirebase();
        return firebase.auth().currentUser
          .delete()
      })
      .then(() => {
        dispatch({ type: 'DELETE_SUCCESS' })
      })
      .catch((err) => {
        console.log(err);
        dispatch({ type: 'DELETE_ERROR', err })
      })  
  }
}

export const registerAction = (newUser) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();
    
    
    firestore.collection('usernames')
    .doc(newUser.username)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return dispatch({ type: 'REGISTER_ERROR', err: { message: 'username exists'} });
      }
      // when creating a document in firebase auth
      // create a document in firestore for users
      //  so we can store more data about the user
      // the id is the same for both
      return firebase.auth().createUserWithEmailAndPassword(
        newUser.email,
        newUser.password
      )
      .then((res) => {
        console.log('reached', res)
        return firestore.collection('users').doc(res.user.uid).set({
          username: newUser.username
        })
      })
      .then(() => {
        // only need to create the user so i can i use it to check
        // if the username exists to make it seem like they are unique
        
        return firestore.collection('usernames').doc(newUser.username)
          .set({
            a: 'a'
          });
      })
      .then(() => {
        dispatch({ type: 'REGISTER_SUCCESS' });
      })
      .catch((err) => {
        dispatch({ type: 'REGISTER_ERROR', err });
      })
    })
    .catch((err) => {
      dispatch({ type: 'REGISTER_ERROR', err });
    })
      

    console.log(newUser, 'Register Action');
  }
};