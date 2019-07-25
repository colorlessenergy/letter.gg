import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loginAction } from '../../store/actions/authActions';
import { Redirect, Link } from 'react-router-dom'
import classes from './Login.module.css';

class Login extends Component {
  state = {
    email: '',
    password: ''
  }

  handleSubmit = (ev) => {
    ev.preventDefault();
    
    this.props.login(this.state);
  }

  handleChange = (ev) => {
    this.setState({
      [ev.target.id]: ev.target.value
    });

  }

  render () {
    const  { authError, auth } = this.props;

    if (auth.uid) {
      return <Redirect to='/' />
    }
    return (
      <div className={classes['form-container']}>
        <form onSubmit={this.handleSubmit} className={classes['form']}>
          <h1 className={classes['form__heading']}>Login to your account now</h1>
          <div className={classes['form__group']}>
            <label
              htmlFor='email'
              className={classes['form__label']}>Email </label>
            <input
              type='email'
              id='email'
              className={classes['form__input']}
              placeholder='Email'
              onChange={this.handleChange}
              value={this.state.email} />
          </div>

          <div className={classes['form__group']}>
            <label
              htmlFor='password'
              className={classes['form__label']}>Password </label>
            <input
              id='password'
              type='password'
              className={classes['form__input']}
              placeholder='Password'
              onChange={this.handleChange}
              value={this.state.password} />
          </div>

          <div>
            {authError ? <p className={classes['error-message']}> {authError} </p> : null}
            <button
              className={[classes['button'], classes['button--default'], classes['button--pink'], classes['button--large']].join(' ')}>Login</button>
          </div>
        </form>

        <div className={classes['register-prompt']}>
          <p>Don't have an account? <Link to='/register' className={classes['register-prompt__link']}>Register</Link></p>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    authError: state.auth.authError,
    auth: state.firebase.auth
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    login: (credentials) => {
      return dispatch(loginAction(credentials));
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Login);