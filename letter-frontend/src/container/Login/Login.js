import React, { Component } from 'react';

class Login extends Component {
  state = {
    email: '',
    password: ''
  }

  handleSubmit = (ev) => {
    ev.preventDefault();
    console.log('login successful', this.state);
  }

  handleChange = (ev) => {
    this.setState({
      [ev.target.id]: ev.target.value
    });

    console.log(this.state);
  }

  render () {
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
        </div>
      </form>
    )
  }
}

export default Login;