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
  deleteReplyAction } from '../../store/actions/buildsAction';

import classes from './DisplayBuild.module.css';


/**
 * display a single build
 * @param {Object} props.build - the information about a single build 
 */

class DisplayBuild extends Component {

  state = {
    userLikedBuild: false,
    comment: '',
    reply: '',
    replyingToID: ''
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
      comment: ''
    })

    this.props.createComment(comment);
  }

  /**
   * when a reply box is submitted 
   * remove the reply box from the UI 
   * and create a document in firestore for the replies collection
   */

  handleCreateReply = (ev) => {
    ev.preventDefault();

    // hide the form to create a reply

    let form = document.querySelector('#' + this.state.replyingToID);
    form.classList.toggle(classes.show);
    this.setState({
      replyingToID: ''
    });

    let replyData = {
      commentReplyingToId: this.state.replyingToID,
      replyMessage: this.state.reply,
      buildId: this.props.match.params.id
    }
    // dispatch the action to create a replyv
    this.props.replyToComment(replyData)
  }
  
  /**
   * show a reply box when a user clicks on the reply button
   * on a comment
   * 
   */

  handleShowReplyForm = (ev) => {
    
    let commentId = ev.target.getAttribute('data-commentid');

    // if the user clicks on reply button and it has already been pressed   
    // close it.
    if (this.state.replyingToID === commentId) {
      let form = document.querySelector('#' + this.state.replyingToID);
      form.classList.toggle(classes.show);

      return this.setState({
        replyingToID: ''
      });
    }

    // close previous reply box if a person click on to reply to a new comment
    if (this.state.replyingToID !== commentId && this.state.replyingToID) {
      let form = document.querySelector('#' + this.state.replyingToID);
      form.classList.toggle(classes.show);

      this.setState({
        reply: '',
        replyingToID: ''
      })
    }
    
    // show the reply box
    let form = document.querySelector('#' + commentId);
    form.classList.toggle(classes.show);
    this.setState({
      replyingToID: commentId
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
            return reply.commentReplyingToId === comment.id;
          })
          .map((reply) => {
            return (
              <div className={classes["replies"]}>
                <p>{reply.creator}  </p>
                <p>{reply.replyMessage}</p>
                {/* only show the delete reply button if the user signed in is the user that made the reply */}
                {reply.authorId === auth.uid ? (
                  <p data-replyid={reply.id} onClick={this.handleDeleteReply}>
                    delete
                  </p>
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
            <p data-commentid={comment.id} onClick={this.handleDeleteComment}>
              delete
            </p>
            ) : null }
            
            {/* only show reply button if the user is signed in */}
            {auth.uid ? (<button onClick={this.handleShowReplyForm} data-commentid={comment.id}>reply</button>) : null }
            <form className={classes['reply-form']} id={comment.id} onSubmit={this.handleCreateReply}>
              <div>
                <label htmlFor='reply'></label>
                <textarea
                  id='reply'
                  value={this.state.reply}
                  cols='100'
                  rows='5'
                  onChange={this.handleChange}
                  placeholder="create a reply!" />
              </div>
              <div>
                <button>
                  reply
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