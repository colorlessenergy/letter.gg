import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import { Redirect } from 'react-router-dom';

import { logOut } from '../../store/actions/authActions';

import classes from './Settings.module.css';

class Settings extends Component {
  render() {
    if (!this.props.auth.uid) {
      return <Redirect to='/login' />
    }

    return (
      <div className={classes['link-container']}>
        <Link className={classes['link']} to='/editbuild'>build settings</Link>
        <Link className={classes['link']} to='/usersettings'>user settings</Link>
        <p className={classes['warning']} onClick={this.props.logOut}>Log Out</p>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logOut: () => dispatch(logOut())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);