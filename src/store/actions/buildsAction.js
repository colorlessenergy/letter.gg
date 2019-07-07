export const createBuildAction = (build) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    console.log('creating build');
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;

    firestore.collection('builds').add({
      ...build,
      creator: profile.username,
      authorId: authorId,
      createdAt: new Date()
    })
    .then(() => {
      dispatch({ type: 'CREATE_BUILD', build: build });
    })
    .catch((err) => {
      dispatch({ type: 'CREATE_BUILD_ERROR', err });
    });

  };
}

/**
 * takes in new information about a build and updates it in firestore
 * 
 * @param {Object} updatedBuild - all the data for the build
 * @param {String} updatedBuild.title - the title of the build
 * @param {String} updatedBuild.champion - the main champion the build is about
 * @param {Array} updatedBuild.items - a list of items for the champion
 * @param {Array} updatedBuild.comp - a list of champions that work well with the main champ
 * @param {String} updatedBuild.content - extra details about the build
 * @param {Number} updatedBuild.id - the id of the build to target it in firestore
 * 
 * 
 */

export const editBuildAction = (updatedBuild, history) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();

    firestore.collection('builds')
      .doc(updatedBuild.id)
      .update({
        title: updatedBuild.title,
        champion: updatedBuild.champion,
        items: updatedBuild.items,
        comp: updatedBuild.comp,
        content: updatedBuild.content,
      })
      .then(() => {
        dispatch({ type: 'EDIT_BUILD_SUCCESS' });
        history.push('/editbuild');
      })
      .catch((err) => {
        dispatch({ type: 'EDIT_BUILD_ERROR', err})
      })

  };
}