import React, { Component } from 'react';

class ContentFormBuild extends Component {
  state = {
    dataFilled: false,
    content: 'write about why this is the best way to use this champion in team fight tactics'
  }

  // pass down the props of the parent component
  // while editing a build to prefill the content 
  // so it shows on the UI

  static getDerivedStateFromProps(props, state) {
    if (props.content && !state.dataFilled) {
      return {
        content: props.content,
        dataFilled: true
      };
    }
  }

  handleChange = (ev) => {
    this.setState({
      [ev.target.id]: ev.target.value
    }, () => {
        if (this.state.content === '') {
          this.setState({
            currentDataNeededFilled: 'you need to write something!'
          });
        } else {
          this.setState({
            currentDataNeededFilled: ''
          });
        }
    });

    // lift the state of this component to the main component to be able to save to a database
    this.props.handleChange({ [ev.target.id]: ev.target.value });
  }

  render () {
    return (
      <div>
        <label htmlFor='content'></label>
        <textarea 
          id='content'
          value={this.state.content}
          cols='100'
          rows='5'
          onChange={this.handleChange} />

        {/* form validation for the user */}

        {
          this.state.currentDataNeededFilled ?
            <p>{this.state.currentDataNeededFilled}</p> :
            null
        }

        {/* display errors if a user doesn't type anything or miss wiht the inputs */}
        {
          !this.state.currentDataNeededFilled && this.props.missingInfo ?
            <p>you need to write something!</p> :
            null
        }
      </div>
    )
  }
}

export default ContentFormBuild;