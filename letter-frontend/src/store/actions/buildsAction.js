export const createBuildAction = (build) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    console.log('creating build');
    const firestore = getFirestore();

    firestore.collection('builds').add({
      ...build,
      creator: 'Brian',
      authorId: 1234,
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

export const getBuildsAction = () => {
  return (dispatch, getState) => {
    console.log('fetching build');
    
    dispatch({ type: 'GET_BUILDS' })
  }
}