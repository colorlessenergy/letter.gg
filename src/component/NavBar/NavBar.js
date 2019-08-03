import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { logOut } from '../../store/actions/authActions';
import classes from './NavBar.module.css';

const NavBar = (props) => {
  const { auth } = props;

  // when a user signs in with firebase auth it provides a property 'uid'
  // if the user is signed in show them build and logout links
  // if they are not logged in show the register and login links
  const links = auth.uid ? (
    <React.Fragment>
      <Link to='/build' className={classes['nav__link']}>create</Link>
      <Link to='/' className={classes['nav__link']}>Letter.gg</Link>
      <Link to='/settings' className={classes['nav__link']}>settings</Link>
    </React.Fragment>
  ) : (
    <React.Fragment>
      <Link to='/login' className={classes['nav__link']}>Login</Link>
      <Link to='/' className={classes['nav__link']}>Letter.gg</Link>
      <Link to='/register' className={classes['nav__link']}>Register</Link>
    </React.Fragment>
  );

  return (
    <div className={classes['nav']}>
      { links }
    </div>
  )
}

const mapStateToProps = (state) => {
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