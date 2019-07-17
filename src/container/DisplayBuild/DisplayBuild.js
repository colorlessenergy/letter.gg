import React, { Component } from 'react';

import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux';
import { Redirect } from'react-router';
import { Link } from 'react-router-dom';

import { upvoteBuildAction, 
  removeUpvoteBuildAction, 
  createCommentAction, 
  createReplyAction,
  deleteCommentAction,
  deleteReplyAction,
  editCommentAction,
  editReplyAction } from '../../store/actions/buildsAction';

import classes from './DisplayBuild.module.css';


/**
 * display a single build
 * @param {Object} props.build - the information about a single build 
 */

class DisplayBuild extends Component {

  state = {
    userLikedBuild: false,
    // this input is to create a comment
    comment: '',
    // this input is to edit a comment or reply
    message: '',
    commentId: '',
    replyId: '',
    action: null
  }

  static getDerivedStateFromProps(props, state) {

    if (props.build) {
      let allUsersLikedBuild = props.build.usersLikedBuild;
      let userUID = props.auth.uid;

      if (allUsersLikedBuild.indexOf(userUID)) {
        return {
          userLikedBuild: true
        }
      } else {
        return {
          userLikedBuild: false
        }
      }
    }
  }
  
  handleCreateComment = (ev) => {
    ev.preventDefault();

    let comment = {
      comment: this.state.comment,
      buildId: this.props.match.params.id
    }

    this.setState({
      comment: '',
      messge: ''
    })

    this.props.createComment(comment);
  }


  /**
   * when a reply box is submitted 
   * remove the reply box from the UI 
   * and create a document in firestore for the replies collection
   */

  handleCreateReplyOrEdit = (ev) => {
    ev.preventDefault();


    // hide the form to create a reply or edit
    let form = document.querySelector('#a' + this.state.commentId);
    form.classList.toggle(classes.show);
  
    this.setState({
      commentId: '',
      replyId: '',
      message: ''
    });

    let commentData = {
      commentId: this.state.commentId,
      replyId: this.state.replyId,
      message: this.state.message,
      buildId: this.props.match.params.id
    }

    if (this.state.action === 'edit-comment') {
      this.props.editComment(commentData);

    } else if (this.state.action === 'edit-reply') {
      this.props.editReply(commentData);

    } else if (this.state.action === 'reply') {
      // dispatch the action to create a reply
      this.props.replyToComment(commentData)
    }
  }
  
  /**
   * show a reply box when a user clicks on the reply button
   * on a comment
   * 
   */

  handleShowReplyForm = (ev) => {
    this.setState({
      action: 'reply',
    });

    this.showTextArea(ev);
  }

  handleShowEditCommentForm = (ev) => {
    this.setState({
      action: 'edit-comment',
    });

    this.showTextArea(ev);
  }

  handleShowEditReplyForm = (ev) => {
    let replyId = ev.target.getAttribute('data-replyid');

    this.setState({
      action: 'edit-reply',
      replyId: replyId
    });

    this.showTextArea(ev);
  }

  /**
   * use the commentId state to open the form text box
   * or close it
   */

  showTextArea = (ev) => {
    let commentId = ev.target.getAttribute('data-commentid');


    // user previously clicked on the reply or edit button 
    // use the same box
    if (this.state.commentId && this.state.commentId === commentId) {
      let form = document.querySelector('#a' + this.state.commentId);
      if (form.classList.length > 1) {
        return;
      }
    }

    // if the user clicks on reply or edit button and it has been pressed before  
    // close it.
    if (this.state.commentId === commentId) {
      let form = document.querySelector('#a' + this.state.commentId);
      form.classList.toggle(classes.show);

      return this.setState({
        commentId: ''
      });
    }

    // close previous chat box if a person click on to reply or edit on a new comment
    if (this.state.commentId !== commentId && this.state.commentId) {
      let form = document.querySelector('#a' + this.state.commentId);
      form.classList.toggle(classes.show);

      this.setState({
        message: '',
        commentId: ''
      })
    }

    // show the edit box
    let form = document.querySelector('#a' + commentId);
    form.classList.toggle(classes.show);

    this.setState({
      commentId: commentId
    });
  }

  handleChange = (ev) => {
    this.setState({
      [ev.target.id]: ev.target.value
    })
  }

  handleUpvote = () => {
    if (!this.props.auth.uid) {
      return <Redirect to='/login' />
    }

    let likedMetadata = {
      userId: this.props.auth.uid,
      buildId: this.props.match.params.id 
    }

    if (likedMetadata.userId && likedMetadata.buildId) {
      this.props.upvoteBuild(likedMetadata);
    }
  }

  handleRemoveUpvote = () => {
    if (!this.props.auth.uid) {
      return <Redirect to='/login' />
    }

    let likedMetadata = {
      userId: this.props.auth.uid,
      buildId: this.props.match.params.id
    }

    if (likedMetadata.userId && likedMetadata.buildId) {
      this.props.removeUpvoteBuild(likedMetadata);
    }
  }

  handleDeleteComment = (ev) => {
    let commentId = ev.target.getAttribute('data-commentid');

    this.props.deleteComment(commentId);
  }

  handleDeleteReply = (ev) => {
    let replyId = ev.target.getAttribute('data-replyid');

    this.props.deleteReply(replyId);
  }

  render () {
    const { build, comments, replies, auth } = this.props;
    let displayComments;
    let repliesToComment;
    if (comments) {
      displayComments = comments.map((comment) => {
        // all the replies are fetched
        // filter all the replies that are for the current comment
        // map through the array and make JSX elements to display
        if (replies) {
          repliesToComment = replies
          .filter((reply) => {
            return reply.commentId === comment.id;
          })
          .map((reply) => {
            return (
              <div className={classes["replies"]}>
                <p>{reply.creator}  </p>
                <p>{reply.message}</p>
                {/* only show the delete reply button if the user signed in is the user that made the reply */}
                {reply.authorId === auth.uid ? (
                  <div>
                    <p data-replyid={reply.id} onClick={this.handleDeleteReply}>
                      delete
                    </p>
                    <p data-replyid={reply.id} data-commentid={comment.id} onClick={this.handleShowEditReplyForm}>
                      edit
                    </p>
                  </div>
                    
                ) : null}
              </div>
            )
          });
        } else {
          repliesToComment = null;
        }

        let jsxComment = (
          <div>
            <p>
              {comment.creator}
            </p>
            <p>
              {comment.comment}
            </p>

            {/* only show the delete comment button if the user signed in is the user that made the comment */}
            {comment.authorId === auth.uid ? (
            <div>
              <p data-commentid={comment.id} onClick={this.handleDeleteComment}>
                delete
              </p>
              <p data-commentid={comment.id} onClick={this.handleShowEditCommentForm}>
                edit
              </p>
            </div>
            ) : null }
            
            {/* only show reply button if the user is signed in */}
            {auth.uid ? (<button onClick={this.handleShowReplyForm} data-commentid={comment.id}>reply</button>) : null }
            {/* 
            i have to add an 'a' to the id because sometimes the id that firebase assigns has a number in the front
            and that isn't a valid css selector
             */}
            <form className={classes['reply-form']} id={'a' + comment.id } onSubmit={this.handleCreateReplyOrEdit}>
              <div>

                <label htmlFor='message'></label>
                <textarea
                  id='message'
                  value={this.state.message}
                  cols='100'
                  rows='5'
                  onChange={this.handleChange}
                  placeholder={ 'create a ' + this.state.action } />
              </div>
              <div>
                <button>
                  submit
                </button>
              </div>
            </form>
            {/* display replies here! */}
            { replies ? repliesToComment : null }
          </div>
          )

        return (
         jsxComment 
        )
      })
    } else {
      displayComments = (
        <p>
          no comments 
        </p>
      )
    }
    
    if (build) {

      // image for the main champion the build 
      let championIcon = require(`../../assets/champion-icons/${build.champion}.png`)
      return (
        <section key={build.champion}>
        {
          this.state.userLikedBuild ?
          <p onClick={this.handleUpvote}>click here if you liked it</p>:
          <p onClick={this.handleRemoveUpvote}>click here to unlike it</p>
        }

        <h2>[{build.champion}] - {build.title}</h2>
        <p>created by: { build.creator }</p>
        <img src={championIcon} alt={build.champion} />
        {build.items.map((item) => {
          let itemIcon = require(`../../assets/item-icons/${item}.png`);
          return <img src={itemIcon} alt={item} key={item} />
        })}

        {build.comp.map((champion) => {
          // images for champions that work well with the main champion
          let championIcon = require(`../../assets/champion-icons/${champion}.png`);
          return <img src={championIcon} alt={champion} key={champion} />
        })}

        <p>
          {build.comment}
        </p>

        {/* a form to create a comment */}
          {this.props.auth.uid ? (
          <form onSubmit={this.handleCreateComment}>
            <div>
              <label htmlFor='comment'></label>
              <textarea
                id='comment'
                value={this.state.comment}
                cols='100'
                rows='5'
                  onChange={this.handleChange}
                placeholder="create a comment!" />
            </div>
            <div>
              <button>
                comment
            </button>
            </div>
          </form>
          ) : (
            <div>
              want to comment?
              <Link to='/login'>login</Link>
              <Link to='/register'>register</Link>
            </div>
          ) }
          { displayComments }
      </section>
    )
  } else {
    return (
       <div>
        {this.props.authError ? <p>{this.props.authError} </p> : <p> loading </p>}
       </div>
      )
    }
  }
}

  const mapStateToProps = (state, ownProps) => {
  const id = ownProps.match.params.id;
  const builds = state.firestore.data.builds;
  const build = builds ? builds[id] : null;
  return {
    build: build,
    comments: state.firestore.ordered.comments,
    replies: state.firestore.ordered.replies,
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    upvoteBuild: (likedMetadata) => {
      dispatch(upvoteBuildAction(likedMetadata));
    },

    removeUpvoteBuild: (likedMetadata) => {
      dispatch(removeUpvoteBuildAction(likedMetadata));
    },

    createComment: (comment) => {
      dispatch(createCommentAction(comment));
    },

    replyToComment: (replyData) => {
      dispatch(createReplyAction(replyData))
    },

    deleteComment: (commentId) => {
      dispatch(deleteCommentAction(commentId));
    },

    deleteReply: (replyId) => {
      dispatch(deleteReplyAction(replyId));
    },

    editComment: (commentData) => {
      dispatch(editCommentAction(commentData));
    },

    editReply: ( commentData ) => {
      dispatch(editReplyAction(commentData));
    }
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'builds' },
    { collection: 'comments', orderBy: ['createdAt', 'desc'] },
    { collection: 'replies', orderBy: ['createdAt', 'desc'] },
  ]),
)(DisplayBuild);