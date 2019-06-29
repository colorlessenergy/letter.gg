export const createBuildAction = (build) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    console.log('creating build');
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid

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

  }
}