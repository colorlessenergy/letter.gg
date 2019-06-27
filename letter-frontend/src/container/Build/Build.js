import React, { Component } from 'react';
import TitleFormBuild from './TitleFormBuild';
import ChampionFormBuild from './ChampionFormBuild';
import ItemFormBuild from './ItemsFormBuild';
import CompFormBuild from './CompFormBuild';
import ContentFormBuild from './ContentFormBuild';

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

    console.log(this.state);
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <h2>pick a title</h2>
        <TitleFormBuild handleChange={this.handleChange} />
        <h2>pick your champion</h2>
        <ChampionFormBuild handleChange={this.handleChange} />
        <h2>pick the best items for this champion</h2>
        <ItemFormBuild handleChange={this.handleChange} />
        <h2>pick champions that work best with this champion</h2>
        <CompFormBuild handleChange={this.handleChange} />
        <h2>write about why this is the best way to use this champion in team fight tactics</h2>
        <ContentFormBuild handleChange={this.handleChange} />
        <div>
          <button>
            create
          </button>
        </div>
      </form>
    );
  }
}

export default Build;