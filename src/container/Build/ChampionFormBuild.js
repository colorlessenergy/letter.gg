import React, {Component} from 'react';

class ChampionFormBuild extends Component {
  state = {
    champion: '',
    filterChampions: [],
    imageURL: '',
    dataFilled: false,
    currentDataNeededFilled: '',
    champions: [
      {"display":"fiora","lookUp":"Fiora"},{"display":"graves","lookUp":"Graves"},{"display":"kassadin","lookUp":"Kassadin"},{"display":"kha’zix","lookUp":"Khazix"},{"display":"mordekaiser","lookUp":"Mordekaiser"},{"display":"nidalee","lookUp":"Nidalee"},{"display":"tristana","lookUp":"Tristana"},{"display":"vayne","lookUp":"Vayne"},{"display":"warwick","lookUp":"Warwick"},{"display":"ahri","lookUp":"Ahri"},{"display":"blitzcrank","lookUp":"Blitzcrank"},{"display":"braum","lookUp":"Braum"},{"display":"darius ","lookUp":"Darius"},{"display":"elise","lookUp":"Elise"},{"display":"lissandra","lookUp":"Lissandra"},{"display":"lucian","lookUp":"Lucian"},{"display":"lulu","lookUp":"Lulu"},{"display":"pyke","lookUp":"Pyke"},{"display":"rek’sai","lookUp":"RekSai"},{"display":"shen","lookUp":"Shen"},{"display":"varus","lookUp":"Varus"},{"display":"zed","lookUp":"Zed"},{"display":"aatrox","lookUp":"Aatrox"},{"display":"ashe","lookUp":"Ashe"},{"display":"cho’gath","lookUp":"Chogath"},{"display":"evelynn","lookUp":"Evelynn"},{"display":"gangplank","lookUp":"Gangplank"},{"display":"katarina","lookUp":"Katarina"},{"display":"kennen","lookUp":"Kennen"},{"display":"morgana","lookUp":"Morgana"},{"display":"poppy","lookUp":"Poppy"},{"display":"rengar","lookUp":"Rengar"},{"display":"shyvana","lookUp":"Shyvana"},{"display":"veigar","lookUp":"Veigar"},{"display":"volibear","lookUp":"Volibear"},{"display":"akali ","lookUp":"Akali"},{"display":"aurelion sol","lookUp":"AurelionSol"},{"display":"brand","lookUp":"Brand"},{"display":"draven","lookUp":"Draven"},{"display":"gnar","lookUp":"Gnar"},{"display":"kindred","lookUp":"Kindred"},{"display":"leona","lookUp":"Leona"},{"display":"sejuani","lookUp":"Sejuani"},{"display":"anivia ","lookUp":"Anivia"},{"display":"karthus","lookUp":"Karthus"},{"display":"kayle","lookUp":"Kayle"},{"display":"miss fortune","lookUp":"MissFortune"},{"display":"swain","lookUp":"Swain"},{"display":"yasuo","lookUp":"Yasuo"}]
  }


  // pass down the props of the parent component
  // while editing a build to prefill the champion 
  // so it shows on the input
  
  static getDerivedStateFromProps (props, state) {
    if (props.champion && !state.dataFilled) {
      let championIcon = require(`../../assets/champion-icons/${props.champion}.png`)
      return {
        champion: props.champion,
        filterChampions: [],
        imageURL: championIcon,
        dataFilled: true,
      };
    }
  }

  // display all the champions initially
  componentDidMount() {
    let initChampions = this.state.champions.map((champion) => {
      return champion;
    });

    this.setState({
      filterChampions: initChampions
    });

  }

  handleChange = (ev) => {
    // filter the champs by what the user typed
    let filterdChamps = this.state.champions.filter((champion) => {
      // adding .toLowerCase() to champion because it wouldn't
      // filter champions properly
      return champion.display.includes(ev.target.value.toLowerCase());
    });

    this.setState({
      filterChampions: filterdChamps,
      champion: ev.target.value,
      imageURL: '',

      // if the input is changing that means a champion isn't picked
      // display this to the user
      currentDataNeededFilled: 'a champion is needed!'
    });

    // passing the state of the champion to the parent
    //  to store in the DB 
    this.props.handleChange({
      champion: ev.target.value
    });
  }

  handleChampionClick = (ev) => {
    // work around to load images into react
    const championIcon = require(`../../assets/champion-icons/${ev.target.id}.png`);

    this.setState({
      champion: ev.target.id,
      filterChampions: [],
      imageURL: championIcon,
      currentDataNeededFilled: ''
    });
    // pass the state of the champion to the parent
    this.props.handleChange({
      champion: ev.target.id,
    });

  }

  render () {
    let filterChampions = null;
    if (this.state.filterChampions.length) {
      filterChampions = this.state.filterChampions.map((champion) => {
        const championIcon = require(`../../assets/champion-icons/${champion.lookUp}.png`);

        // unsure to display the champion icon or just the text for the champion

        return (
          // <p id={champion.lookUp} onClick={this.handleChampionClick} key={champion.lookUp}>
          //   {champion.display}
          // </p>
          <img id={champion.lookUp} onClick={this.handleChampionClick} key={champion.lookUp} src={championIcon} alt={champion.display} />
        );
      });
    } else {
      filterChampions = null;
    }
    
    return (
      <React.Fragment>
        {this.state.imageURL ? <img src={this.state.imageURL} alt={this.state.champion} /> : null }
        <div>
          <label htmlFor='champion'>Champion: </label>
          <input
            id='champion'
            type='text'
            onChange={this.handleChange}
            value={this.state.champion} />
        </div>
        {/*
            regular error handling when user is typing
        */}
        {
          this.state.currentDataNeededFilled ? 
          <p>{this.state.currentDataNeededFilled }</p> : 
          null 
        }
        {/*
            when the user presses submit and doesn't type anything in the input
            display an error
        */}
        {
          !this.state.currentDataNeededFilled && this.props.missingInfo ?
            <p>a champion is needed!</p> :
            null
        }
        {filterChampions}
      </React.Fragment>
    )
  }
}

export default ChampionFormBuild;