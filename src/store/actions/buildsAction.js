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
 * 
 * stores a comment inside the comments collection
 * 
 * @param {Object} comment - data about the comment
 * @param {String} comment.buildId - the id of the build the comment is made in
 * @param {String} comment.comment - the comment content the user created
 */

export const createCommentAction = (comment) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();

    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;


    return firestore.collection('comments')
    .add({
      comment: comment.comment,
      buildId: comment.buildId,
      creator: profile.username,
      authorId: authorId,
      createdAt: new Date()
    })
    .then(() => {
      dispatch({ type: 'CREATE_COMMENT_SUCCESS' });
    })
    .catch((err) => {
      dispatch({ type: 'CREATE_COMMENT_ERROR', err });
    });
  }
}


/**
 * 
 * @param {Object} reply - holds data about the reply
 * @param {String} message - the message the user created
 * @param {String} commentId - the id of the comment the user is replying too
 */
export const createReplyAction = (reply) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();

    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;


    // have to make a separate collection instead of subcollection
    // because it is a cleaner and painless way of
    // fetching all the replies to a comment
    
    return firestore.collection('replies')
      .add({
        message: reply.message,
        commentId: reply.commentId,
        buildId: reply.buildId,
        creator: profile.username,
        authorId: authorId,
        createdAt: new Date()
      })
      .then(() => {
        dispatch({ type: 'CREATE_REPLY_SUCCESS' });
      })
      .catch(err =>  {
        dispatch({ type: 'CREATE_REPLY_ERROR', err });
      })
  }
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

/**
 * 
 * when deleting a build delete all the comments and replies on them
 * 
 * queried for the comments and replies that have the id of the build
 * loop through them then delete every single one
 * 
 * 
 * @param {String} buildId - the id of the build to find the build, comment and reply
 * @param {Object} history - history to redirect the url back to editbuild
 */

export const deleteBuildAction = (buildId, history) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    
    // delete the build in firestore
    firestore
      .collection('builds')
      .doc(buildId)
      .delete()
      // delete all comments for the build
      .then(() => {
        return firestore
        .collection('comments')
        .where('buildId', '==', buildId)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            firestore
              .collection('comments')
              .doc(doc.id)
              .delete()
              .catch(err => dispatch({ type: 'DELETE_BUILD_ERROR', err }));
          })
        })
      })
      .then(() => {
        //  delete all the replies for a build
        return firestore
          .collection('replies')
          .where('buildId', '==', buildId)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              firestore
                .collection('replies')
                .doc(doc.id)
                .delete()
                .catch(err => dispatch({ type: 'DELETE_BUILD_ERROR', err }))
            })
          })
      })
      .then(() => {
        dispatch({ type: 'DELETE_BUILD_SUCCESS' })
        return history.push('/editbuild');
      })
  }
}

export const deleteCommentAction = (commentId) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();

    firestore
      .collection('comments')
      .doc(commentId)
      .delete()
      .then(() => {
        dispatch({ type: 'DELETE_COMMENT_SUCCESS' });
      })
      .catch(err => dispatch({ type: 'DELETE_COMMENT_ERROR', err }));
  }
}

export const deleteReplyAction = (replyId) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();

    firestore
      .collection('replies')
      .doc(replyId)
      .delete()
      .then(() => {
        dispatch({ type: 'DELETE_REPLY_SUCCESS' });
      })
      .catch(err => dispatch({ type: 'DELETE_REPLY_ERROR', err }));
  }
}

export const editCommentAction = (comment) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();

    firestore
      .collection('comments')
      .doc(comment.commentId)
      .update({
        comment: comment.message
      })
      .then(() => {
        dispatch({ type: 'EDIT_COMMENT_SUCCESS' });
      })
      .catch(err => dispatch({ type: 'EDIT_COMMENT_ERROR', err }));
  }
}

export const editReplyAction = (reply) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();

    firestore
      .collection('replies')
      .doc(reply.replyId)
      .update({
        message: reply.message
      })
      .then(() => {
        dispatch({ type: 'EDIT_REPLY_SUCCESS' });
      })
      .catch(err => dispatch({ type: 'EDIT_REPLY_ERROR', err}));
  }
}