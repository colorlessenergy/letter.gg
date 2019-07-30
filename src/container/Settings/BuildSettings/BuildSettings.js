import React, { Component } from 'react';

import { firestoreConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { compose } from 'redux';

import BuildList from '../../../component/BuildList/BuildList';

import classes from './BuildSettings.module.css';

/**
 * display builds and will link each build to a page to edit it
 * 
 */

class BuildSettings extends Component {
  render() {
    let { builds, auth } = this.props;
    let buildsArray = builds ? builds.filter((build) => {
        return build.authorId === auth.uid;
      }) : [];

    return (
      <React.Fragment>
        <h2 className={classes['title']}>
          edit a build
        </h2>
        <BuildList url='/editbuild/' builds={buildsArray} />
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    builds: state.firestore.ordered.builds
  }
}

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'builds', orderedBy: ['createdAt', 'desc'] }
  ])
  )(BuildSettings);