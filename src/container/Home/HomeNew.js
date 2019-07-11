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

  render() {
    return (
      <React.Fragment>
        <SortOptions />
        <BuildList url='/build/' builds={this.props.builds} />
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