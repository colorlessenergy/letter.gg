import React, { Component } from 'react';
import TitleFormBuild from '../../../Build/TitleFormBuild';
import ChampionFormBuild from '../../../Build/ChampionFormBuild';
import ItemFormBuild from '../../../Build/ItemsFormBuild';
import CompFormBuild from '../../../Build/CompFormBuild';
import ContentFormBuild from '../../../Build/ContentFormBuild';

import { editBuildAction, deleteBuildAction } from '../../../../store/actions/buildsAction';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase'
import { Redirect } from 'react-router-dom';


import classes from './EditBuild.module.css';

// reusing form classes used when creating a build
import formClasses from '../../../Build/Build.module.css';


/**
 * this is the form to edit and delete the build
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

    if (!state.dataFilled && build) {
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

    if (this.state.title !== '' &&
        this.state.champion !== '' &&
        this.state.content !== '' &&
        this.state.items.length &&
        this.state.comp.length) {

      this.setState({
        currentDataNeededFilled: ''
      });

      // pass the id of the build so
      // firestore can fetch 
      // the correct build
      let updatedBuild = {
        ...this.state,
        id: this.props.match.params.id
      }

      this.props.editBuild(updatedBuild, this.props.history);

    } else {
      this.setState({
        currentDataNeededFilled: 'information is missing!'
      });
    }

  }

  handleDeleteBuild = () => {
    this.props.deleteBuild(this.props.match.params.id, this.props.history);
  }

  render() {
    const { auth, authError, build } = this.props;
    

    if (!auth.uid) return <Redirect to='/login' />

    return (
      <React.Fragment>

        <h2 className={classes['title']}>
          Editing a build
        </h2>
        <form className={formClasses['form']} onSubmit={this.handleSubmit}>

          {/* button to delete a build */}
          <p className={classes['error']} onClick={this.handleDeleteBuild}>click here to delete your build!</p>

          <h2 className={formClasses['form__title']}>create a title for your build</h2>
          <TitleFormBuild
            missingInfo={this.state.currentDataNeededFilled && !this.state.title ? true : false}
            title={build ? build.title : ''}
            handleChange={this.handleChange} />

          <h2 className={formClasses['form__title']}>pick the main champion</h2>
          <p className={formClasses['form__description']}>The champion the build will be based on</p>
          <ChampionFormBuild
            missingInfo={this.state.currentDataNeededFilled && !this.state.champion ? true : false}
            champion={build ? build.champion : ''}
            handleChange={this.handleChange} />

          <h2 className={formClasses['form__title']}>choose the best items</h2>
          <p className={formClasses['form__description']}>click on selected items to remove them</p>
          <ItemFormBuild
            missingInfo={this.state.currentDataNeededFilled && !this.state.items.length ? true : false}
            items={build ? build.items : []}
            handleChange={this.handleChange} />

          <h2 className={formClasses['form__title']}>champion comp</h2>
          <p className={formClasses['form__description']}>click on selected champions to remove them</p>
          <CompFormBuild
            missingInfo={this.state.currentDataNeededFilled && !this.state.comp.length ? true : false}
            comp={build ? build.comp : []}
            handleChange={this.handleChange} />

          <h2 className={formClasses['form__title']}>write about the strategy</h2>
          <ContentFormBuild
            missingInfo={this.state.currentDataNeededFilled && !this.state.content ? true : false}
            content={build ? build.content : ''} 
            handleChange={this.handleChange} />
          <div>
          
          <button className={formClasses['button']}>update</button>
          {authError ? <p>{authError}</p> : null}
          {this.state.currentDataNeededFilled ? <p>{this.state.currentDataNeededFilled}</p> : null}
          </div>
        </form>
      </React.Fragment>
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
    },

    deleteBuild: (buildId, history) => {
      return dispatch(deleteBuildAction(buildId, history));
    }
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'builds' }
  ])
  )(EditBuild);