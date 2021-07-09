import React, { Component } from 'react';
import TitleFormBuild from './TitleFormBuild';
import ChampionFormBuild from './ChampionFormBuild';
import ItemFormBuild from './ItemsFormBuild';
import CompFormBuild from './CompFormBuild';
import ContentFormBuild from './ContentFormBuild';

import { createBuildAction } from '../../store/actions/buildsAction';

import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';


import classes from './Build.module.css';

/**
 * this is the form to create a build
 * 
 */

class Build extends Component {
  state = {
    title: '',
    champion: '',
    items: [],
    comp: [],
    content: '',
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

        this.props.createBuild(this.state);
        this.props.history.push('/');
      } else {
        this.setState({
          currentDataNeededFilled: 'information is missing!'
        });
      }

  }

  render () {
    const { auth } = this.props;

    if (!auth.uid) return <Redirect to='/login' />

    return (
      <form className={classes['form']} onSubmit={this.handleSubmit}>
        <h2 className={classes['form__title']}>create a title for your build</h2>
        <TitleFormBuild missingInfo={this.state.currentDataNeededFilled && !this.state.title ? true : false } handleChange={this.handleChange} />
        
        <h2 className={classes['form__title']}>pick the main champion</h2>
        <p className={classes['form__description']}>The champion the build will be based on</p>
        <ChampionFormBuild missingInfo={this.state.currentDataNeededFilled && !this.state.champion ? true : false } handleChange={this.handleChange} />
        
        <h2 className={classes['form__title']}>choose the best items</h2>
        <p className={classes['form__description']}>click on selected items to remove them</p>
        <ItemFormBuild missingInfo={this.state.currentDataNeededFilled && !this.state.items.length ? true : false } handleChange={this.handleChange} />
        
        <h2 className={classes['form__title']}>champion comp</h2>
        <p className={classes['form__description']}>click on selected champions to remove them</p>
        <CompFormBuild missingInfo={this.state.currentDataNeededFilled && !this.state.comp.length ? true : false } handleChange={this.handleChange} />
        
        <h2 className={classes['form__title']}>write about the strategy</h2>
        <ContentFormBuild missingInfo={this.state.currentDataNeededFilled && !this.state.content ? true : false } handleChange={this.handleChange} />
        <div>
          <button className={classes['button']}>
            create
          </button>

          {this.state.currentDataNeededFilled ? 
          <p className={[classes['error'], classes['error--ml']].join(' ')}>{this.state.currentDataNeededFilled}</p> : 
          null}
        </div>
      </form>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createBuild: (build) => {
      return dispatch(createBuildAction(build))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Build);