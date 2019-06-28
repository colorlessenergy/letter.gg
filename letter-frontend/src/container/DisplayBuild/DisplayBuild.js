import React from 'react';

import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux';

const DisplayBuild = (props) => {
  console.log(props)
  const { build } = props;

  // main champion the build is about
  if (build) {
    let championIcon = require(`../../assets/champion-icons/${build.champion}.png`)
    return (
      <section key={build.champion}>
        <h2>[{build.champion}] - {build.title}</h2>
        <img src={championIcon} alt={build.champion} />
        {build.items.map((item) => {
          let itemIcon = require(`../../assets/item-icons/${item}.png`);
          return <img src={itemIcon} alt={item} key={item} />
        })}

        {build.comp.map((champion) => {
          // champions that work well with the main champion
          let championIcon = require(`../../assets/champion-icons/${champion}.png`);
          return <img src={championIcon} alt={champion} key={champion} />
        })}

        <p>
          {build.content}
        </p>
      </section>
    )
  } else {
    return (
      <p> loading </p>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.match.params.id;
  console.log(state)
  const builds = state.firestore.data.builds;
  const build = builds ? builds[id] : null;

  return {
    build: build
  }
}

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'builds' }
  ]),
)(DisplayBuild);