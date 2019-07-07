import React, { Component } from 'react';

import { connect } from 'react-redux';

import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';

import BuildList from '../../component/BuildList/BuildList';

/**
 * display all the builds
 */
class Home extends Component {

  render () {
    return (
      <BuildList url='/build/' builds={this.props.builds} />
    )
  }
}

const mapStateToProps = (state) => {
  console.log(state)
  return {
    builds: state.firestore.ordered.builds
  }
}

export default compose(
  connect(mapStateToProps),
  // when firestore changes or component load sync the state
  //  of firestore with this component state
  firestoreConnect([
    { collection: 'builds', orderedBy: ['createdAt', 'desc'] }
  ])
)(Home);