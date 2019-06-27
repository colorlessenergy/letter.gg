import React, { Component } from 'react';

import { connect } from 'react-redux';
import { getBuildsAction } from '../../store/actions/buildsAction';

class Home extends Component {
  componentDidMount = () => {
    console.log('compdidmount HOME.JS')
    this.props.getBuilds();
  }

  render () {
    let builds = this.props.builds.length ? (
      this.props.builds.map((build) => {
        console.log(build);
        let championIcon = require(`../../assets/champion-icons/${build.champion}.png`)
        return (
          <React.Fragment>
            <h2>[{ build.champion }] - { build.title }</h2>
            <img src={championIcon} alt={build.champion} />
            { build.items.map((item) => {
              let itemIcon = require(`../../assets/item-icons/${item}.png`);
              return <img src={itemIcon} alt={item} key={item} />
            }) }

            { build.comp.map((champion) => {
              let championIcon = require(`../../assets/champion-icons/${champion}.png`);
              return <img src={championIcon} alt={champion} key={champion} />
            }) }
          </React.Fragment>
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
  return {
    builds: state.builds.builds
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getBuilds: () => {
      return dispatch(getBuildsAction())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);