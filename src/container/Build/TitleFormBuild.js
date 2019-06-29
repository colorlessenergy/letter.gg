import React, {Component} from 'react';

class TitleFormBuild extends Component {
  state = {
    title: ''
  }

  handleChange = (ev) => {
    this.setState({
      [ev.target.id]: ev.target.value
    });

     // passing the state of the champion to the parent
    //  to store in the DB 

    this.props.handleChange({
      [ev.target.id]: ev.target.value
    });
  }

  render() {
    return (
      <div>
        <label
          htmlFor='title'>Title: </label>
        <input
          type='text'
          id='title'
          onChange={this.handleChange}
          value={this.state.title} />
      </div>
    );
  }
}

export default TitleFormBuild;