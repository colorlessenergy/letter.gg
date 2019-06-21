import React, { Component } from 'react';

class Register extends Component {
  state = {
    email: '',
    username: '',
    password: ''
  }

  handleSubmit = (ev) => {
    ev.preventDefault();
    console.log('register successful', this.state);
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
        </div>
      </form>
    )
  }
}

export default Register;