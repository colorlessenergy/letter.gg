import React, { Component } from 'react';

class UserSettings extends Component {
  state = {
    username: '',
    email: '',
    password: ''
  }

  onChange = (ev) => {
    this.setState({
      [ev.target.id]: ev.target.value
    })
  }

  onSubmit = (ev) => {
    ev.preventDefault();

    console.log(this.state);
  }

  render () {
    return (
      <form onSubmit={this.onSubmit}>
        <div>
          <label htmlFor="email">Email: </label>
          <input type="email" 
            id="email" 
            onChange={this.onChange} 
            value={this.state.email} />
        </div>
        <div>
          <label htmlFor="username">Username: </label>
          <input type="text"
            id="username"
            onChange={this.onChange}
            value={this.state.username} />
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input type="password"
            id="password"
            onChange={this.onChange}
            value={this.state.password} />
        </div>
        <div>
          <button>
            update
          </button>
        </div>
      </form>
    )
  }
}

export default UserSettings;