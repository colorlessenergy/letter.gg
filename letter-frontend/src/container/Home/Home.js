import React, { Component } from 'react';

import { connect } from 'react-redux';

import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';

import { Link } from 'react-router-dom'
/**
 * display all the builds
 */
class Home extends Component {

  render () {
    let builds = this.props.builds ? (
      this.props.builds.map((build, index) => {
        console.log(build);
        let championIcon = require(`../../assets/champion-icons/${build.champion}.png`)
        return (
          <Link to={'/build/' + build.id} key={index}>
            <section>
              <h2>[{build.champion}] - {build.title}</h2>
              <img src={championIcon} alt={build.champion} />
              {build.items.map((item) => {
                let itemIcon = require(`../../assets/item-icons/${item}.png`);
                return <img src={itemIcon} alt={item} key={item} />
              })}

              {build.comp.map((champion) => {
                let championIcon = require(`../../assets/champion-icons/${champion}.png`);
                return <img src={championIcon} alt={champion} key={champion} />
              })}
            </section>
          </Link>
        )
      })
    ) : (
      <p>no builds</p>
    );
    
    console.log(builds)

    return (
      <div>
        { builds }
      </div>
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