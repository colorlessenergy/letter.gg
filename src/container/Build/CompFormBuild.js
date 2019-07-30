import React, { Component } from 'react';

import classes from './Build.module.css';


class CompFormBuild extends Component {
  state = {
    pickedChampions: [],
    champion: '',
    filteredChampions: [],
    dataFilled: false,
    currentDataNeededFilled: '',
    champions: [{ "display": "fiora", "lookUp": "Fiora" }, { "display": "graves", "lookUp": "Graves" }, { "display": "kassadin", "lookUp": "Kassadin" }, { "display": "kha’zix", "lookUp": "Khazix" }, { "display": "mordekaiser", "lookUp": "Mordekaiser" }, { "display": "nidalee", "lookUp": "Nidalee" }, { "display": "tristana", "lookUp": "Tristana" }, { "display": "vayne", "lookUp": "Vayne" }, { "display": "warwick", "lookUp": "Warwick" }, { "display": "ahri", "lookUp": "Ahri" }, { "display": "blitzcrank", "lookUp": "Blitzcrank" }, { "display": "braum", "lookUp": "Braum" }, { "display": "darius ", "lookUp": "Darius" }, { "display": "elise", "lookUp": "Elise" }, { "display": "lissandra", "lookUp": "Lissandra" }, { "display": "lucian", "lookUp": "Lucian" }, { "display": "lulu", "lookUp": "Lulu" }, { "display": "pyke", "lookUp": "Pyke" }, { "display": "rek’sai", "lookUp": "RekSai" }, { "display": "shen", "lookUp": "Shen" }, { "display": "varus", "lookUp": "Varus" }, { "display": "zed", "lookUp": "Zed" }, { "display": "aatrox", "lookUp": "Aatrox" }, { "display": "ashe", "lookUp": "Ashe" }, { "display": "cho’gath", "lookUp": "Chogath" }, { "display": "evelynn", "lookUp": "Evelynn" }, { "display": "gangplank", "lookUp": "Gangplank" }, { "display": "katarina", "lookUp": "Katarina" }, { "display": "kennen", "lookUp": "Kennen" }, { "display": "morgana", "lookUp": "Morgana" }, { "display": "poppy", "lookUp": "Poppy" }, { "display": "rengar", "lookUp": "Rengar" }, { "display": "shyvana", "lookUp": "Shyvana" }, { "display": "veigar", "lookUp": "Veigar" }, { "display": "volibear", "lookUp": "Volibear" }, { "display": "akali ", "lookUp": "Akali" }, { "display": "aurelion sol", "lookUp": "AurelionSol" }, { "display": "brand", "lookUp": "Brand" }, { "display": "draven", "lookUp": "Draven" }, { "display": "gnar", "lookUp": "Gnar" }, { "display": "kindred", "lookUp": "Kindred" }, { "display": "leona", "lookUp": "Leona" }, { "display": "sejuani", "lookUp": "Sejuani" }, { "display": "anivia ", "lookUp": "Anivia" }, { "display": "karthus", "lookUp": "Karthus" }, { "display": "kayle", "lookUp": "Kayle" }, { "display": "miss fortune", "lookUp": "MissFortune" }, { "display": "swain", "lookUp": "Swain" }, { "display": "yasuo", "lookUp": "Yasuo" }]
  }

  // pass down the props of the parent component
  // while editing a build to prefill the comp  
  // so it shows on the UI
  static getDerivedStateFromProps(props, state) {
    if (props.comp && props.comp.length && !state.dataFilled) {
      return {
        pickedChampions: props.comp,
        dataFilled: true
      };
    }
  }



  // display all the champions initially
  componentDidMount() {
    let initChampions = this.state.champions.map((champion) => {
      return champion;
    });

    this.setState({
      filteredChampions: initChampions
    });

  }

  handleChange = (ev) => {
    if (ev.target.value !== "") {
      let filteredChampions = this.state.champions.filter((item) => {
        // adding .toLowerCase() to champion because it wouldn't
        // filter champions properly
        return item.display.includes(ev.target.value.toLowerCase())
      });

      this.setState({
        filteredChampions: filteredChampions
      });
    }

    this.setState({
      champion: ev.target.value,
    });
  }

  handleItemClick = (ev) => {
    let arr = [...this.state.pickedChampions, ev.target.id];
    let formValidationString = '';

    if (arr.length) {
      formValidationString = '';
    }
    
    this.setState({
      pickedChampions: arr,
      currentDataNeededFilled: formValidationString,
      champion: ''
    }, () => {
      this.props.handleChange({
        comp: this.state.pickedChampions
      });
    });
  }

  handleRemoveItem = (ev) => {
    let arr = this.state.pickedChampions.filter((champ, index) => {
      return index !== Number(ev.target.id);
    });

    let formValidationString = '';


    if (arr.length === 0) {
      formValidationString = 'a single champion is needed!';
    }

    this.setState({
      pickedChampions: arr,
      currentDataNeededFilled: formValidationString
    }, () => {
      this.props.handleChange({
        comp: this.state.pickedChampions
      })
    });
  }

  displayChampion = (champion) => {
    const championIcon = require(`../../assets/champion-icons/${champion.lookUp}.png`);


    return (
      <img className={classes['images__image']} onClick={this.handleItemClick} id={champion.lookUp} key={champion.display} src={championIcon} alt={champion.display} />
    );
  }

  render() {
    let displayedChampions = null;

    if (this.state.champion === '') {
      displayedChampions = this.state.champions.map(this.displayChampion);
    } else if (this.state.filteredChampions.length) {
      displayedChampions = this.state.filteredChampions.map(this.displayChampion);
    } else {
      displayedChampions = null;
    }

    let pickedChampions = null;

    if (this.state.pickedChampions.length) {
      pickedChampions = this.state.pickedChampions.map((champion, index) => {
        const championIcon = require(`../../assets/champion-icons/${champion}.png`);
        return (
          <img className={[classes['images__picked'], classes['images__image']].join(' ')} onClick={this.handleRemoveItem} key={index} id={index} src={championIcon} alt={champion} />
        );
      });
    } else {
      pickedChampions = null;
    }

    return (
      <React.Fragment>
        <div className={classes['form__group']}>
          <label className={classes['form__label']} htmlFor='champion'>Champion</label>
          <input
            id='champion'
            type='text'
            placeholder='champion name'
            className={classes['form__input']}
            onChange={this.handleChange}
            value={this.state.champion} />
            {pickedChampions}
            
          {/*
            regular error handling when user is typing
          */}
          {
            this.state.currentDataNeededFilled ?
              <p className={classes['error']}>{this.state.currentDataNeededFilled}</p> :
              null
          }
          {/*
            when the user presses submit and doesn't type anything in the input
            display an error
          */}
          {
            !this.state.currentDataNeededFilled && this.props.missingInfo ?
              <p className={classes['error']}>a single champion is needed!</p> :
              null
          }
          <div className={classes['images']}>
            {displayedChampions}
          </div>
        </div>
      </React.Fragment>

    )
  }
}

export default CompFormBuild;