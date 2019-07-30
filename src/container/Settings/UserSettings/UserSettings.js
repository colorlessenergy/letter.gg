import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';

import { resetStateForUpdateUserAction } from '../../../store/actions/authActions';


import classes from './UserSettings.module.css'

class UserSettings extends Component {

  componentWillMount() {
    // reset the state of weather the user is updated
    // when it reaches this page so the user can update their
    // information again
    this.props.resetStateForUpdateUser();
  }

  render () {
    if (!this.props.auth.uid) {
      return <Redirect to='/login' />
    }
    return (
      <div className={classes['link-container']}>
        <Link className={classes['link']} to='/updateemail'>update email</Link>
        <Link className={classes['link']} to='/updatepassword'>update password</Link>
        <Link className={classes['link']} to='/updateusername'>update username</Link>
        <Link className={classes['warning']} to='/deleteuser'>delete user</Link>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetStateForUpdateUser: () => {
      dispatch(resetStateForUpdateUserAction());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);