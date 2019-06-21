import React, { Component } from 'react';
import { connect } from 'react-redux';
import { registerAction } from '../../store/actions/authActions';

class Register extends Component {
  state = {
    email: '',
    username: '',
    password: ''
  }

  handleSubmit = (ev) => {
    ev.preventDefault();

    console.log('register successful', this.state);
    this.props.register(this.state);
  }

  handleChange = (ev) => {
    this.setState({
      [ev.target.id]: ev.target.value
    });

    console.log(this.state);
  }

  render () {
    const { authError } = this.props;

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
            htmlFor='username'>Username: </label>
          <input
            type='text'
            id='username'
            onChange={this.handleChange}
            value={this.state.username} />
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
          <button>Register</button>
          { authError ? <p>{ authError } </p> : null }
        </div>
      </form>
    )
  }
}

const mapStateToProps = (state) => {
  return{ 
    ...state,
    authError: state.auth.authError
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