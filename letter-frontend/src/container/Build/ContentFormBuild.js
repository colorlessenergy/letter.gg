import React, { Component } from 'react';

class ContentFormBuild extends Component {
  state = {
    content: 'write about why this is the best way to use this champion in team fight tactics'
  }

  handleChange = (ev) => {
    this.setState({
      [ev.target.id]: ev.target.value
    });

    // lift the state of the textarea to the main component to be able to save to a database
    this.props.handleChange({ [ev.target.id]: ev.target.value });
  }

  render () {
    return (
      <React.Fragment>
        <label htmlFor='content'> </label>
        <textarea 
          id='content'
          value={this.state.content}
          cols='100'
          rows='5'
          onChange={this.handleChange} />
      </React.Fragment>
    )
  }
}

export default ContentFormBuild;