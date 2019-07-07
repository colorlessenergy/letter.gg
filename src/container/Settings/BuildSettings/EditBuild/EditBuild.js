import React, { Component } from 'react';
import TitleFormBuild from '../../../Build/TitleFormBuild';
import ChampionFormBuild from '../../../Build/ChampionFormBuild';
import ItemFormBuild from '../../../Build/ItemsFormBuild';
import CompFormBuild from '../../../Build/CompFormBuild';
import ContentFormBuild from '../../../Build/ContentFormBuild';

import { editBuildAction } from '../../../../store/actions/buildsAction';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase'
import { Redirect } from 'react-router-dom';


/**
 * this is the form to edit a build
 * 
 */

class EditBuild extends Component {
  state = {
    title: '',
    champion: '',
    items: [],
    comp: [],
    content: '',
    dataFilled: false
  }
  
  static getDerivedStateFromProps(props, state) {
    const { build } = props;

    // preset values so the user sees the current 
    // configuration for the build they are editing

    if (!state.dataFilled) {
     return {
        title: build.title,
        champion: build.champion,
        items: build.items,
        comp: build.comp,
        content: build.content,
        dataFilled: true
      };
    }
  }

  // state is lifted up from the child components 

  handleChange = (state) => {
    this.setState(state);
  }

  handleSubmit = (ev) => {
    ev.preventDefault();

    // pass the id of the build so
    // firestore can fetch 
    // the correct build
    let updatedBuild = {
      ...this.state,
      id: this.props.match.params.id
    }

    this.props.editBuild(updatedBuild, this.props.history);

  }

  render() {
    const { auth, authError, build } = this.props;
    

    if (!auth.uid) return <Redirect to='/login' />

    return (
      <form onSubmit={this.handleSubmit}>
        <h2>pick a title</h2>
        <TitleFormBuild title={ build ? build.title : '' } handleChange={this.handleChange} />
        
        <h2>pick your champion</h2>
        <ChampionFormBuild champion={build ? build.champion : ''} handleChange={this.handleChange} />
        
        <h2>pick the best items for this champion</h2>
        <ItemFormBuild items={ build ? build.items : []  } handleChange={this.handleChange} />
        
        <h2>pick champions that work best with this champion</h2>
        <CompFormBuild comp={build ? build.comp : []} handleChange={this.handleChange} />
        
        <h2>write about why this is the best way to use this champion in team fight tactics</h2>
        <ContentFormBuild content={build ? build.content : ''} handleChange={this.handleChange} />
        <div>
          <button>
            update
          </button>
          { authError ? <p>{ authError }</p>: null }
        </div>
      </form>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.match.params.id;
  const builds = state.firestore.data.builds;
  const build = builds ? builds[id] : null;

  return {
    auth: state.firebase.auth,
    build: build
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    editBuild: (build, history) => {
      return dispatch(editBuildAction(build, history))
    }
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'builds' }
  ])
  )(EditBuild);