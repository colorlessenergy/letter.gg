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
      createdAt: new Date(),
      usersLikedBuild: [],
      upvotes: 0
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

export const upvoteBuildAction = (likedMetadata) => {
  return (dispatch, getState, { getFirestore }) => {
    console.log('upvoted successfully', likedMetadata);
    const firestore = getFirestore();

    if (likedMetadata.buildId && likedMetadata.userId) {
      firestore
        .collection('builds')
        .doc(likedMetadata.buildId)
        .update({
          usersLikedBuild: firestore.FieldValue.arrayUnion(likedMetadata.userId),
          upvotes: firestore.FieldValue.increment(1)
        })
        .then(() => {
          dispatch({ type: 'UPVOTE_BUILD_SUCCESS' });
        })
        .catch((err) => {
          dispatch({ type: 'UPVOTE_BUILD_ERROR', err });
          console.log('err', err);
        })
    }
  }
}

export const removeUpvoteBuildAction = (likedMetadata) => {
  return (dispatch, getState, { getFirestore }) => {
    console.log('removed upvoted successfully', likedMetadata);
    const firestore = getFirestore();

    if (likedMetadata.buildId && likedMetadata.userId) {
      firestore
        .collection('builds')
        .doc(likedMetadata.buildId)
        .update({
          usersLikedBuild: firestore.FieldValue.arrayRemove(likedMetadata.userId),
          upvotes: firestore.FieldValue.increment(-1)
        })
        .then(() => {
          dispatch({ type: 'UPVOTE_BUILD_SUCCESS' });
        })
        .catch((err) => {
          dispatch({ type: 'UPVOTE_BUILD_ERROR', err });
          console.log('err', err);
        })
    }

  }
}