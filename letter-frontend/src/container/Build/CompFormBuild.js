import React, { Component } from 'react';

class CompFormBuild extends Component {
  state = {
    pickedChampions: [],
    champion: '',
    filteredChampions: [],
    champions: [{ "display": "fiora", "lookUp": "Fiora" }, { "display": "graves", "lookUp": "Graves" }, { "display": "kassadin", "lookUp": "Kassadin" }, { "display": "kha’zix", "lookUp": "Khazix" }, { "display": "mordekaiser", "lookUp": "Mordekaiser" }, { "display": "nidalee", "lookUp": "Nidalee" }, { "display": "tristana", "lookUp": "Tristana" }, { "display": "vayne", "lookUp": "Vayne" }, { "display": "warwick", "lookUp": "Warwick" }, { "display": "ahri", "lookUp": "Ahri" }, { "display": "blitzcrank", "lookUp": "Blitzcrank" }, { "display": "braum", "lookUp": "Braum" }, { "display": "darius ", "lookUp": "Darius" }, { "display": "elise", "lookUp": "Elise" }, { "display": "lissandra", "lookUp": "Lissandra" }, { "display": "lucian", "lookUp": "Lucian" }, { "display": "lulu", "lookUp": "Lulu" }, { "display": "pyke", "lookUp": "Pyke" }, { "display": "rek’sai", "lookUp": "RekSai" }, { "display": "shen", "lookUp": "Shen" }, { "display": "varus", "lookUp": "Varus" }, { "display": "zed", "lookUp": "Zed" }, { "display": "aatrox", "lookUp": "Aatrox" }, { "display": "ashe", "lookUp": "Ashe" }, { "display": "cho’gath", "lookUp": "Chogath" }, { "display": "evelynn", "lookUp": "Evelynn" }, { "display": "gangplank", "lookUp": "Gangplank" }, { "display": "katarina", "lookUp": "Katarina" }, { "display": "kennen", "lookUp": "Kennen" }, { "display": "morgana", "lookUp": "Morgana" }, { "display": "poppy", "lookUp": "Poppy" }, { "display": "rengar", "lookUp": "Rengar" }, { "display": "shyvana", "lookUp": "Shyvana" }, { "display": "veigar", "lookUp": "Veigar" }, { "display": "volibear", "lookUp": "Volibear" }, { "display": "akali ", "lookUp": "Akali" }, { "display": "aurelion sol", "lookUp": "AurelionSol" }, { "display": "brand", "lookUp": "Brand" }, { "display": "draven", "lookUp": "Draven" }, { "display": "gnar", "lookUp": "Gnar" }, { "display": "kindred", "lookUp": "Kindred" }, { "display": "leona", "lookUp": "Leona" }, { "display": "sejuani", "lookUp": "Sejuani" }, { "display": "anivia ", "lookUp": "Anivia" }, { "display": "karthus", "lookUp": "Karthus" }, { "display": "kayle", "lookUp": "Kayle" }, { "display": "miss fortune", "lookUp": "MissFortune" }, { "display": "swain", "lookUp": "Swain" }, { "display": "yasuo", "lookUp": "Yasuo" }]
  }

  // display all the champions initially
  componentDidMount() {
    let initChampions = this.state.champions.map((champion) => {
      return champion;
    })

    this.setState({
      filteredChampions: initChampions
    });

  }

  handleChange = (ev) => {
    if (ev.target.value !== "") {
      let filteredChampions = this.state.champions.filter((item) => {
        return item.display.includes(ev.target.value)
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
    this.setState({
      pickedChampions: arr
    }, () => {
      this.props.handleChange({
        comp: this.state.pickedChampions
      });
    });
  }

  handleRemoveItem = (ev) => {
    let arr = this.state.pickedChampions.filter((champ, index) => {
      console.log(index, ev.target.id)
      return index != ev.target.id;
    });


    this.setState({
      pickedChampions: arr
    }, () => {
      this.props.handleChange({
        comp: this.state.pickedChampions
      })
    })
  }

  render() {
    let displayedChampions = null;

    if (this.state.filteredChampions.length) {
      displayedChampions = this.state.filteredChampions.map((champion) => {
        const championIcon = require(`../../assets/champion-icons/${champion.lookUp}.png`);

        // unsure to display the champion icon or have the name of the champion

        return (
          // <p onClick={this.handleItemClick} id={champion.lookUp} key={champion.display}>
          //   { champion.display }
          // </p>
          <img onClick={this.handleItemClick} id={champion.lookUp} key={champion.display} src={championIcon} alt={champion.display} />
        )
      })
    } else {
      displayedChampions = null;
    }

    let pickedChampions = null;

    if (this.state.pickedChampions.length) {
      pickedChampions = this.state.pickedChampions.map((champion, index) => {
        const championIcon = require(`../../assets/champion-icons/${champion}.png`);
        return (
          <img onClick={this.handleRemoveItem} key={index} id={index} src={championIcon} alt={champion} />
        )
      })
    } else {
      pickedChampions = null;
    }

    return (
      <React.Fragment>
        {pickedChampions}
        <div>
          <label
            htmlFor='champion'>
            Champion
        </label>
          <input
            type='text'
            id='champion'
            onChange={this.handleChange}
            value={this.state.champion}>
          </input>
        </div>
        <div>
          {displayedChampions}
        </div>
      </React.Fragment>

    )
  }
}

export default CompFormBuild;