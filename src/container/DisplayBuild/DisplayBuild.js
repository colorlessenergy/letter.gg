import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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

// for quill to display the html
import renderHTML from 'react-render-html';

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
    prevAction: null,
    action: ''
  }

  static getDerivedStateFromProps(props, state) {
    if (props.build) {
      let allUsersLikedBuild = props.build.usersLikedBuild;
      let userUID = props.auth.uid;

      if (allUsersLikedBuild.indexOf(userUID)) {
        return {
          userLikedBuild: true
        };
      }
      else {
        return {
          userLikedBuild: false
        };
      }
    }
  }

  handleCreateComment = (ev) => {
    ev.preventDefault();
    let comment = {
      comment: this.state.comment,
      buildId: this.props.match.params.id
    };
    this.setState({
      comment: '',
      messge: ''
    });

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
    };

    if (this.state.action === 'edit-comment') {
      this.props.editComment(commentData);

    }
    else if (this.state.action === 'edit-reply') {
      this.props.editReply(commentData);
    }
    else if (this.state.action === 'reply') {
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
    let buttonClicked = ev.target;

    this.setState({
      prevAction: this.state.action,
      action: 'reply'
    }, () => {
      this.showTextArea(buttonClicked);
    });
    
  }

  handleShowEditCommentForm = (ev) => {
    let buttonClicked = ev.target;
    this.setState({
      prevAction: this.state.action,
      action: 'edit-comment'
    }, () => {
      this.showTextArea(buttonClicked);
    });
  }

  handleShowEditReplyForm = (ev) => {
    let replyId = ev.target.getAttribute('data-replyid');
    let buttonClicked = ev.target;

    this.setState({
      prevAction: this.state.action,
      action: 'edit-reply',
      replyId: replyId
    }, () => {
      this.showTextArea(buttonClicked);
    });
  }

  /**
   * use the commentId state to open the form text box
   * or close it
   */

  showTextArea = (buttonClicked) => {
    let commentId = buttonClicked.getAttribute('data-commentid');
    if (this.state.commentId === commentId) {
      let form = document.querySelector('#a' + this.state.commentId);
      // user previously clicked on the reply or edit button 
      // use the same box
      if (form.classList.length > 1 && 
      this.state.action !== this.state.prevAction) {
        form.querySelector('.ql-editor').dataset.placeholder = 'Create a  ' + this.state.action;
        return;
      }
      else {
        // close reply box
        form.classList.toggle(classes.show);
        return this.setState({
          commentId: '',
          action: ''
        });
      }
    }

    // close previous chat box if a person click on to reply or edit on a new comment
    if (this.state.commentId !== commentId && this.state.commentId) {
      let form = document.querySelector('#a' + this.state.commentId);
      form.classList.toggle(classes.show);

      this.setState({
        message: '',
        commentId: '',
        action: ''
      })
    }

    // show the textbox when none have been pressed initially 
    // or one has been closed
    let form = document.querySelector('#a' + commentId);
    form.classList.toggle(classes.show);
    form.querySelector('.ql-editor').dataset.placeholder = 'Create a ' + this.state.action;

    this.setState({
      commentId: commentId
    });
  }

  handleChange = (ev) => {
    this.setState({
      [ev.target.id]: ev.target.value
    });
  }

  onQuillCommentChange = (ev) => {
    this.setState({ comment: ev });
  }

  onQuillReplyChange = (ev) => {
    this.setState({ message: ev });
  }

  handleUpvote = () => {
    if (!this.props.auth.uid) {
      return <Redirect to='/login' />;
    }

    let likedMetadata = {
      userId: this.props.auth.uid,
      buildId: this.props.match.params.id 
    };

    if (likedMetadata.userId && likedMetadata.buildId) {
      this.props.upvoteBuild(likedMetadata);
    }
  }

  handleRemoveUpvote = () => {
    if (!this.props.auth.uid) {
      return <Redirect to='/login' />;
    }

    let likedMetadata = {
      userId: this.props.auth.uid,
      buildId: this.props.match.params.id
    };

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

  modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
      ['code-block']
    ]
  }

  formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link',
    'code-block'
  ]


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
            // format the date for the reply to month day, year
            let date = new Date(reply.createdAt.seconds * 1000);
            let dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
            date = date.toLocaleDateString('en-US', dateOptions);
            return (
              // ===============
              // a reply
              // ===============
              <div className={classes['replies']}>
                <p>{reply.creator} <span className={classes['replies--ml']}>{date}</span></p>
                <div>
                  { renderHTML(reply.message) }
                </div>
                {/* only show the delete reply button if the user signed in is the user that made the reply */}
                <div className={classes['comment-controls']}>
                  {reply.authorId === auth.uid ? (
                    <React.Fragment>
                      <p
                        className={classes['comment-controls__control']}
                        data-replyid={reply.id}
                        data-commentid={comment.id}
                        onClick={this.handleShowEditReplyForm}>
                        edit
                      </p>
                      <p
                        className={classes['comment-controls__control']}
                        data-replyid={reply.id}
                        onClick={this.handleDeleteReply}>
                        delete
                      </p>
                    </React.Fragment>
                  ) : null}
                </div>
              </div>
            )
          });
        } else {
          repliesToComment = null;
        }
        // =================
        // a comment
        // =================
        console.log(comment, build)
          // format the created at date for comment to month day, year
        let commentDate = new Date(comment.createdAt.seconds * 1000);
        let commentDateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        commentDate = commentDate.toLocaleDateString('en-US', commentDateOptions);
        let jsxComment = (
          <div>
            <p>{comment.creator} <span className={classes['comment--ml']}>{ commentDate }</span> </p>
            <div>
              { renderHTML(comment.comment) }
            </div>
            <div className={classes['comment-controls']}>
              {/* only show reply button if the user is signed in */}
              {auth.uid ? (<button className={[classes['button'], classes['button--default'], classes['button--pink'], classes['comment-controls__control']].join(' ')} onClick={this.handleShowReplyForm} data-commentid={comment.id}>reply</button>) : null }
              {/* only show the delete comment button if the user signed in is the user that made the comment */}
              { comment.authorId === auth.uid ? (
                <React.Fragment>
                  <p
                    className={classes['comment-controls__control']}
                    data-commentid={comment.id}
                    onClick={this.handleShowEditCommentForm}>
                    edit
                  </p>
                  <p
                    className={classes['comment-controls__control']}
                    data-commentid={comment.id}
                    onClick={this.handleDeleteComment}>
                    delete
                  </p>
                </React.Fragment>
              ) : null }
            </div>
            {/* 
            i have to add an 'a' to the id because sometimes the id that firebase assigns has a number in the front
            and that isn't a valid css selector
             */}
            {/* ========================== */}
            {/* form to create a reply */}
            {/* ========================== */}
            <form className={classes['reply-form']} id={'a' + comment.id } onSubmit={this.handleCreateReplyOrEdit}>
              <div>
                <label htmlFor='message'></label>
                <ReactQuill
                  id='message'
                  modules={this.modules}
                  formats={this.formats}
                  value={this.state.message}
                  onChange={this.onQuillReplyChange}
                  data-placeholder='create a comment'
                />
              </div>
              <div>
                <button className={[classes['button'], classes['button--default'], classes['button--pink'], classes['button--margin-top']].join(' ')}>Submit</button>
              </div>
            </form>
            {/* display replies here! */}
            { replies ? repliesToComment : null }
          </div>
        );
        return (
         jsxComment 
        );
      });
    }
    else {
      displayComments = (
        <p>no comments</p>
      );
    }
    
    if (build) {
      // format the date into month day year
      let date = new Date(build.createdAt.seconds * 1000);
      let dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      date = date.toLocaleDateString('en-US', dateOptions);

      // image for the main champion the build 
      let championIcon = require(`../../assets/champion-icons/${build.champion}.png`);
      return (
        // ================
        // build
        // ================
        <section key={build.champion} className={classes.build}>
          {/* ================ */}
          {/* build intro      */}
          {/* ================ */}
          <div className={classes['build__intro']}>
            <img src={championIcon} alt={build.champion} />
            {
              auth.uid ?
              (this.state.userLikedBuild ?
              <p onClick={this.handleUpvote} className={[classes['button'], classes['button--pink'], classes['button--large']].join(' ')}>Like</p> :
              <p onClick={this.handleRemoveUpvote} className={[classes['button'], classes['button--pink'], classes['button--large']].join(' ')}>unlike</p>)
              : null
            }
          </div>
          {/* ================ */}
          {/* build title      */}
          {/* ================ */}
          <div className={classes['build__title']}>
            <p className={classes['build__info-title']}>created by {build.creator} <span className={classes['build__info--ml']}>{build.upvotes} likes</span> <span className={classes['build__info--ml']}>{date}</span></p>
            <h2 className={classes['build__main-title']}>{build.champion} <span className={classes['build__main-title--margin']}>{build.title}</span></h2>
          </div>
          {/* ================ */}
          {/* build build      */}
          {/* ================ */}
          <div className={classes['build__build']}>
            <p className={classes['build__category-title']}>Build</p>
            {build.items.map((item, index) => {
              let itemIcon = require(`../../assets/item-icons/${item}.png`);
              return <img src={itemIcon} alt={item} key={item + index} className={classes['image']} />
            })}
          </div>
          {/* ================ */}
          {/* build team       */}
          {/* ================ */}
          <div className={classes['build__team']}>
            <p className={classes['build__category-title']}>Comp</p>
            {build.comp.map((champion, index) => {
              // images for champions that work well with the main champion
              let championIcon = require(`../../assets/champion-icons/${champion}.png`);
              return <img src={championIcon} alt={champion} key={champion + index} className={classes['image']} />
            })}
          </div>
          {/* ===================== */}
          {/* rendered build output */}
          {/* ===================== */}
          <div className={classes['build__guide']}>
            <p className={classes['build__category-title']}>Guide</p>
            { renderHTML(build.content) }
          </div>
          {/* ========================== */}
          {/* a form to create a comment */}
          {/* ========================== */}
          { this.props.auth.uid ? (
            <form onSubmit={this.handleCreateComment}>
              <div>
                <label htmlFor='comment'></label>
                <ReactQuill
                  id='comment'
                  modules={this.modules}
                  formats={this.formats}
                  value={this.state.comment}
                  onChange={this.onQuillCommentChange}
                  placeholder='Create a comment'
                />
              </div>
              <div className={classes['button--container']}>
                <button className={[classes['button'], classes['button--default'], classes['button--pink'], classes['button--large'], classes['button--margin-top']].join(' ')}>comment</button>
              </div>
            </form>
          ) : (
            <div className={classes['build__login-prompt']}>
              want to comment?
              <Link to='/login' className={[classes['button'], classes['button--border'], classes['button--margin']].join(' ')}>login</Link>
              <Link to='/register' className={[classes['button'], classes['button--pink'], classes['button--margin']].join(' ')}>register</Link>
            </div>
          ) }
          { displayComments }
      </section>
    );
  }
  else {
    return (
       <div>
        {this.props.authError ? <p>{this.props.authError} </p> : <p> loading </p>}
       </div>
      );
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
    };
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