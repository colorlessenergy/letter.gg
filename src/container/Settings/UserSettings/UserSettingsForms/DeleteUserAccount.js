import React, { Component } from 'react';

import { connect } from 'react-redux';

import { Redirect } from 'react-router-dom'

import { DeleteUserAction } from '../../../../store/actions/authActions';

import classes from './UserSettingsForm.module.css';

class DeleteUserAccount extends Component {
  componentDidMount() {
    if (!this.props.reauthenticateSuccess) {
      this.props.history.push('/reauthenticate');
    }
  }

  deleteAccount = () => {
    this.props.deleteUser();
  }

  render () {

    if (this.props.accountIsDeleted) {
      this.props.history.push('/')
      return (<p> redirecting.. </p>);
    }

    if (!this.props.auth.uid) {
      return <Redirect to='/login' />
    }

    return (
      <div className={classes['form-container']}>
        <h2 className={classes['form__title']}>
          Delete your account
        </h2>
        <p className={classes['form__description']}>
          by pressing the button delete your account you be deleted and you will not be able to recover it!
        </p>

        <p 
          className={classes['warning']} 
          onClick={this.deleteAccount}>
          click here to delete your account!
        </p>

        { this.props.authError ? <p>{ this.props.authError }</p> : null }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    authError: state.auth.authError,
    reauthenticateSuccess: state.auth.reauthenticateSuccess,
    accountIsDeleted: state.auth.accountIsDeleted,
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteUser: () => {
      dispatch(DeleteUserAction());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteUserAccount);