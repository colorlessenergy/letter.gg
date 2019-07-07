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
    });

    // lift the state of this component to the main component to be able to save to a database
    this.props.handleChange({ [ev.target.id]: ev.target.value });
  }

  render () {
    return (
      <React.Fragment>
        <label htmlFor='content'></label>
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