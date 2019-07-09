import React, {Component} from 'react';

class TitleFormBuild extends Component {
  state = {
    title: '',
    dataFilled: false,
    currentDataNeededFilled: ''
  }

  // pass down the props of the parent component
  // will editing a build to prefill the title 
  // so it shows on the input

  static getDerivedStateFromProps(props, state) {
    if (props.title && !state.dataFilled) {
      return {
        title: props.title,
        dataFilled: true
      };
    }
  }

  handleChange = (ev) => {
    this.setState({
      [ev.target.id]: ev.target.value
    }, () => {
      if (this.state.title === '') {
        this.setState({
          currentDataNeededFilled: 'A title is needed'
        });
      } else {
        this.setState({
          currentDataNeededFilled: ''
        });
      }
    });

    // passing the state of the champion to the parent
    //  to store in the DB 

    this.props.handleChange({
      [ev.target.id]: ev.target.value
    });
  }

  render() {

    console.log(this.props)

    return (
      <div>
        <label
          htmlFor='title'>Title: </label>
        <input
          type='text'
          id='title'
          onChange={this.handleChange}
          value={this.state.title} />
        { 
          this.state.currentDataNeededFilled ? 
          <p>{ this.state.currentDataNeededFilled }</p> : 
          null 
        }

        {/* display errors if a user doesn't type anything or miss wiht the inputs */}
        {
          !this.state.currentDataNeededFilled && this.props.missingInfo ?
            <p>A title is needed</p> :
            null
        }
      </div>
    );
  }
}

export default TitleFormBuild;