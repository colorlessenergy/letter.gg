import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { connect } from 'react-redux';
import { updateUserUsernameAction } from '../../../../store/actions/authActions';



class UpdateUserEmail extends Component {
  state = {
    username: ''
  }

  handleChange = (ev) => {
    this.setState({
      [ev.target.id]: ev.target.value
    })
  }

  handleSubmit = (ev) => {
    ev.preventDefault();
    let updateUser = {
      ...this.state,
      UID: this.props.auth.uid
    }
    this.props.updateUserUsername(updateUser);
  }

  render() {
    if (this.props.userUpdated) {
      this.props.history.goBack();
      return (<p> redirecting.. </p>);
    }

    if (!this.props.auth.uid) {
      return <Redirect to='/login' />
    }
    return (
      <div>
        <h2>
          update username
        </h2>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="username">Username: </label>
            <input type="text"
              id="username"
              onChange={this.handleChange}
              value={this.state.username} />
          </div>
          <button>
            update
          </button>

          {this.props.authError ? <p>{this.props.authError}</p> : null}
          {this.props.userUpdated ? <p> updated email successfully </p> : null}
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    authError: state.auth.authError,
    userUpdated: state.auth.userUpdated
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserUsername: (updateUser) => {
      dispatch(updateUserUsernameAction(updateUser));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateUserEmail)