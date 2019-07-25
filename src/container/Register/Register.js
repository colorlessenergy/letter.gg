import React, { Component } from 'react';
import { connect } from 'react-redux';
import { registerAction } from '../../store/actions/authActions';
import { Redirect, Link } from 'react-router-dom';
import classes from './Register.module.css';

class Register extends Component {
  state = {
    email: '',
    username: '',
    password: ''
  }

  handleSubmit = (ev) => {
    ev.preventDefault();
    this.props.register(this.state);
  }

  handleChange = (ev) => {
    this.setState({
      [ev.target.id]: ev.target.value
    });
  }

  render () {
    const { authError, auth } = this.props;

    if (auth.uid) return <Redirect to='/' />

    return (
      <div className={classes['form-container']}>
        <div className={classes['intro']}>
          <h1 className={classes['intro__heading']}>Letter.gg</h1>
          <div className={classes['intro__group']}>
            <h3 className={classes['intro__subheading']}>Want to share your thoughts</h3>
            <p className={classes['intro__text']}>Enter your email address to create an account</p>
          </div>
          <div className={classes['intro__group']}>
            <h3 className={classes['intro__subheading']}>Share your experiences with other players</h3>
            <p className={classes['intro__text']}>Create a guide for a strategy you used in team fight tactics that worked for you! </p>
          </div>
        </div>

        <div>
          <form onSubmit={this.handleSubmit} className={classes['form']}>
            <h2 className={classes['form__heading']}>Create your account now</h2>

            <div className={classes['form__group']}>
              <label
                htmlFor='email'
                className={classes['form__label']}>Email </label>
              <input
                id='email'
                type='email'
                className={classes['form__input']}
                placeholder='Email'
                onChange={this.handleChange}
                value={this.state.email} />
            </div>

            <div className={classes['form__group']}>
              <label
                htmlFor='username'
                className={classes['form__label']}>Username </label>
              <input
                id='username'
                type='text'
                className={classes['form__input']}
                placeholder='Username'
                onChange={this.handleChange}
                value={this.state.username} />
            </div>

            <div className={classes['form__group']}>
              <label
                htmlFor='Password'
                className={classes['form__label']}>Password </label>
              <input
                id='password'
                type='password'
                className={classes['form__input']}
                placeholder='password'
                onChange={this.handleChange}
                value={this.state.password} />
            </div>

            <div>
              {authError ? <p className={classes['error-message']}>{authError} </p> : null}
              <button
                className={[classes['button'], classes['button--default'], classes['button--pink'], classes['button--large']].join(' ')}
              >Create your account</button>
            </div>
          </form>

          <div className={classes['login-prompt']}>
            <p>Already have an account? <Link to='/login' className={classes['login-prompt__link']}>Login</Link></p>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state)
  return{ 
    ...state,
    authError: state.auth.authError,
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    register: (credentials) => {
      return dispatch(registerAction(credentials));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);