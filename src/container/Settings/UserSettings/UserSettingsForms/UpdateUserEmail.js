import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { connect } from 'react-redux';
import { updateUserEmailAction } from '../../../../store/actions/authActions';

import classes from './UserSettingsForm.module.css';


class UpdateUserEmail extends Component {
  state = {
    email: ''
  }

  componentDidMount() {
    if (!this.props.reauthenticateSuccess) {
      this.props.history.push('/reauthenticate');
    }
  }

  handleChange = (ev) => {
    this.setState({
      [ev.target.id]: ev.target.value
    })
  }

  handleSubmit = (ev) => {
    ev.preventDefault();
 
    this.props.updateUserEmail(this.state);
  }

  render () {

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
          update email
        </h2>
        <p className={classes['form__description']}>
          Update to a new email address
        </p>

        <form onSubmit={this.handleSubmit}>
          <div className={classes['form__group']}>
            <label 
              className={classes['form__label']}
              htmlFor="email">
                Email 
            </label>
            <input type="email"
              id="email"
              placeholder='update email'
              className={classes['form__input']}
              onChange={this.handleChange}
              value={this.state.email} />
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
    reauthenticateSuccess: state.auth.reauthenticateSuccess,
    userUpdated: state.auth.userUpdated
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserEmail: (updateUser) => {
      dispatch(updateUserEmailAction(updateUser));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateUserEmail)