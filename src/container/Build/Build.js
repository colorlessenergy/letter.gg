import React, { Component } from 'react';
import TitleFormBuild from './TitleFormBuild';
import ChampionFormBuild from './ChampionFormBuild';
import ItemFormBuild from './ItemsFormBuild';
import CompFormBuild from './CompFormBuild';
import ContentFormBuild from './ContentFormBuild';

import { createBuildAction } from '../../store/actions/buildsAction';

import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';


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
      <form onSubmit={this.handleSubmit}>
        <h2>pick a title</h2>
        <TitleFormBuild missingInfo={this.state.currentDataNeededFilled && !this.state.title ? true : false } handleChange={this.handleChange} />
        <h2>pick your champion</h2>
        <ChampionFormBuild missingInfo={this.state.currentDataNeededFilled && !this.state.champion ? true : false } handleChange={this.handleChange} />
        <h2>pick the best items for this champion</h2>
        <ItemFormBuild missingInfo={this.state.currentDataNeededFilled && !this.state.items.length ? true : false } handleChange={this.handleChange} />
        <h2>pick champions that work best with this champion</h2>
        <CompFormBuild missingInfo={this.state.currentDataNeededFilled && !this.state.comp.length ? true : false } handleChange={this.handleChange} />
        <h2>write about why this is the best way to use this champion in team fight tactics</h2>
        <ContentFormBuild missingInfo={this.state.currentDataNeededFilled && !this.state.content ? true : false } handleChange={this.handleChange} />
        <div>
          <button>
            create
          </button>

          {this.state.currentDataNeededFilled ? <p>{this.state.currentDataNeededFilled}</p> : null}
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