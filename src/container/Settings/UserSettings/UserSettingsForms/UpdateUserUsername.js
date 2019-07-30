import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { connect } from 'react-redux';
import { updateUserUsernameAction } from '../../../../store/actions/authActions';

import classes from './UserSettingsForm.module.css';

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
      <div className={classes['form-container']}>
        <h2 className={classes['form__title']}>
          update username
        </h2>
        <p className={classes['form__description']}>
          Update to a new username
        </p>

        <form onSubmit={this.handleSubmit}>
          <div className={classes['form__group']}>
            <label className={classes['form__label']} htmlFor="username">Username: </label>
            <input type="text"
              id="username"
              className={classes['form__input']}
              placeholder='update username'
              onChange={this.handleChange}
              value={this.state.username} />
          </div>
          <button className={classes['button']}>
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