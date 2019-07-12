import React, { Component } from 'react';

import { connect } from 'react-redux';

import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';

import BuildList from '../../component/BuildList/BuildList';
import SortOptions from './SortOptions'

/**
 * display all the builds
 */
class Home extends Component {
  state = {
    filteredBuilds: [],
    champion: ''
  }

  /**
   * if the input to filter champions is empty 
   * display all the builds
   * 
   * @param {*} props - props which contains all the builds
   * @param {*} state = state which contains the value of the input
   */

  static getDerivedStateFromProps(props, state) {
    if (state.champion === '') {
      return {
        filteredBuilds: props.builds
      }
    }
  }

  /**
   *  get the value of the input and sort the champions with that value
   *  
   *  @param {String} ev.target.value - the string that user inputs to filter champions
   */

  handleChange = (ev) => {

    let filteredBuilds = this.props.builds.filter((build) => {
      return build.champion.toLowerCase().includes(ev.target.value);
    });

    this.setState({
      champion: ev.target.value,
      filteredBuilds: filteredBuilds
    })
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <label htmlFor="champion">
            champion
          </label>
          <input type="text"
            onChange={this.handleChange}
            id="champion"
            value={this.state.champion} />
        </div>

        <SortOptions />
        <BuildList url='/build/' builds={this.state.filteredBuilds} />
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    builds: state.firestore.ordered.builds
  }
}

export default compose(
  connect(mapStateToProps),
  // when firestore changes or component load sync the state
  //  of firestore with this component state
  firestoreConnect([
    { collection: 'builds', orderBy: ['createdAt', 'desc'] }
  ])
)(Home);