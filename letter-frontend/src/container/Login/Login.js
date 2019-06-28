import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loginAction } from '../../store/actions/authActions';
import { Redirect } from 'react-router-dom'


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

    if (auth.uid) return <Redirect to='/' />

    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label
            htmlFor='email'>Email: </label>
          <input
            type='email'
            id='email'
            onChange={this.handleChange}
            value={this.state.email} />
        </div>

        <div>
          <label
            htmlFor='password'>Password: </label>
          <input
            type='password'
            id='password'
            onChange={this.handleChange}
            value={this.state.password} />
        </div>

        <div>
          <button>Login</button>
          { authError ? <p> { authError } </p> : null }

        </div>
      </form>
    )
  }
}

const mapStateToProps = (state) => {
  console.log(state)
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