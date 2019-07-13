import React, { Component } from 'react';

import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux';
import { Redirect } from'react-router';
import { Link } from 'react-router-dom';

import { upvoteBuildAction, removeUpvoteBuildAction, createCommentAction } from '../../store/actions/buildsAction';

/**
 * display a single build
 * @param {Object} props.build - the information about a single build 
 */

class DisplayBuild extends Component {

  state = {
    userLikedBuild: false,
    comment: ''
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

  handleCommentChange = (ev) => {

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

  render () {
    const { build, comments } = this.props;
    console.log(this.props)
    let displayComments;

    if (comments) {
      displayComments = comments.map((comment) => {
        return (
          <div>
            <p>
              { comment.creator }
            </p>
            <p>
              { comment.comment }
            </p>
          </div>
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
                onChange={this.handleCommentChange}
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
  console.log(state)
  return {
    build: build,
    comments: state.firestore.ordered.comments,
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
      console.log('dispatching create comment')
      dispatch(createCommentAction(comment));
    }
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'builds' },
    { collection: 'comments', orderBy: ['createdAt', 'desc'] }
  ]),
)(DisplayBuild);