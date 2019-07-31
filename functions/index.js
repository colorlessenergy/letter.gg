const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);


/**
 * 
 * get all the builds that have the username previous name before updating it
 * change the 'creator' field to the new username
 * 
 * @param {Object} preValue.username - the username before it was updated 
 * @param {Object} newValue - the username after the update
 */
const updateBuildAuthor = (preValue, newValue) => {
  return admin.firestore().collection('builds').where('creator', '==', preValue.username)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach(function (doc) {
        admin.firestore().collection('builds')
          .doc(doc.id)
          .update({
            creator: newValue.username
          });
      });
    })
    .catch((err) => {
      console.log('error fetching builds in cloud function ', err)
    })
}

/**
 * a cloud function that is executed everytime the user
 * collection is changed it will call updateBuildAuthor and pass two
 * arguments which contain data about the user before and after it was updated
 *
 */

exports.updateUserBuildAuthor = functions.firestore
  .document('/users/{userId}')
  .onUpdate((change) => {
    const newValue = change.after.data();
    const previousValue = change.before.data();
    
    return updateBuildAuthor(previousValue, newValue);
  })

