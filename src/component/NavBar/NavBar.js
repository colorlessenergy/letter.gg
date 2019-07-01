import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { logOut } from '../../store/actions/authActions';

const NavBar = (props) => {
  const { auth } = props;

  // when a user signs in with firebase auth it provides a property 'uid'
  // if the user is signed in show them build and logout links
  // if they are not logged in showthe register and login links
  const links = auth.uid ? (
    <React.Fragment>
      <Link to='/build'>Build</Link>
      <Link to='/settings'>settings</Link>
      <p onClick={props.logOut}>Log Out</p>
    </React.Fragment>
  ) : (
    <React.Fragment>
      <Link to='/register'>Register</Link>
      <Link to='/login'>Login</Link>
    </React.Fragment>
  );

  return (
    <div className="App">
      <Link to='/'>
        Letter.gg
      </Link>
      { links }
      
    </div>
  )
}

const mapStateToProps = (state) => {
  console.log(state)
  return {
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logOut: () => dispatch(logOut())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);