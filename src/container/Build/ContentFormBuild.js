import React, { Component } from 'react';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

class ContentFormBuild extends Component {
  state = {
    dataFilled: false,
    content: ''
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

  onQuillChange = (e) => {
    this.setState({
      content: e
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
    this.props.handleChange({ content: this.state.content });
  }

  modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{list: 'ordered'}, {list: 'bullet'}],
      ['link'],
      ['clean'],
      ['code-block']
    ]
  };

  formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link',
    'code-block'
  ];

  render () {
    return (
      <div>
        <label htmlFor='content'>Content: </label>
        <ReactQuill
          id="content"
          modules={this.modules}
          formats={this.formats}
          value={this.state.content}
          placeholder='write about why this is the best way to use this champion in team fight tactics'
          onChange={this.onQuillChange} />
        {/*
          regular error handling when user is typing
        */}
        {
          this.state.currentDataNeededFilled ?
            <p>{this.state.currentDataNeededFilled}</p> :
            null
        }
        {/*
          when the user presses submit and doesn't type anything in the input
          display an error
        */}
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