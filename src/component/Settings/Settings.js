import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import { Redirect } from 'react-router-dom';

import { logOut } from '../../store/actions/authActions';

class Settings extends Component {
  render() {
    console.log('WE HERE BOIS');
    console.log(this.props);
    if (!this.props.auth.uid) {
      return <Redirect to='/login' />
    }

    return (
      <div>
        <Link to='/editbuild'>build settings</Link>
        <Link to='/usersettings'>user settings</Link>
        <p onClick={this.props.logOut}>Log Out</p>
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