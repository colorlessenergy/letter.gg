import React, {Component} from 'react';

import classes from './Build.module.css';


class ItemsFormBuild extends Component {
  state = {
    pickedItems: [],
    item: '',
    filteredItems: [],
    currentDataNeededFilled: '',
    dataFilled: false,
    items: [
      {"display":"force of nature","lookUp":"forceofnature"},{"display":"frozen heart","lookUp":"frozenheart"},{"display":"guinsoo's rageblade","lookUp":"guinsoosrageblade"},{"display":"phantom dancer","lookUp":"phantomdancer"},{"display":"rapid firecannon","lookUp":"rapidfirecannon"},{"display":"spear of shojin","lookUp":"spearofshojin"},{"display":"blade of the ruined king","lookUp":"bladeoftheruinedking"},{"display":"bloodthirster","lookUp":"bloodthirster"},{"display":"frozen mallet","lookUp":"frozenmallet"},{"display":"luden's echo","lookUp":"ludensecho"},{"display":"morellonomicon","lookUp":"morellonomicon"},{"display":"seraph's embrace","lookUp":"seraphsembrace"},{"display":"thornmail","lookUp":"thornmail"},{"display":"youmuu's ghostblade","lookUp":"youmuusghostblade"},{"display":"yuumi","lookUp":"yuumi"},{"display":"zeke's herald","lookUp":"zekesherald"},{"display":"zephyr","lookUp":"zephyr"},{"display":"cursed blade","lookUp":"cursedblade"},{"display":"dragon's claw","lookUp":"dragonsclaw"},{"display":"hextech gunblade","lookUp":"hextechgunblade"},{"display":"infinity edge","lookUp":"infinityedge"},{"display":"locket of the iron solari","lookUp":"locketoftheironsolari"},{"display":"rabadon's deathcap","lookUp":"rabadonsdeathcap"},{"display":"red buff","lookUp":"redbuff"},{"display":"runaan's hurricane","lookUp":"runaanshurricane"},{"display":"statikk shiv","lookUp":"statikkshiv"},{"display":"sword of the divine","lookUp":"swordofthedivine"},{"display":"titanic hydra","lookUp":"titanichydra"},{"display":"warmog's armor","lookUp":"warmogsarmor"},{"display":"hush","lookUp":"hush"},{"display":"ionic spark","lookUp":"ionicspark"},{"display":"knight's vow","lookUp":"knightsvow"},{"display":"sword breaker","lookUp":"swordbreaker"},{"display":"darkin","lookUp":"darkin"},{"display":"guardian angel","lookUp":"guardianangel"},{"display":"redemption","lookUp":"redemption"}]
  }

  // pass down the props of the parent component
  // will editing a build to prefill the pickeditem 
  // so it shows on the UI

  static getDerivedStateFromProps(props, state) {
    if (props.items && props.items.length && !state.dataFilled) {
      return {
        pickedItems: props.items,
        dataFilled: true
      };

    }
  }

  // display the items initally 
  componentDidMount () {
    let initItems = this.state.items.map((item) => {
      return item
    });
    
    this.setState({
      filteredItems: initItems
    });
  }

  handleChange = (ev) => {
    let filteredItems = this.state.items.filter((item) => {
       // adding .toLowerCase() to champion because it wouldn't
      // filter champions properly
      return item.display.includes(ev.target.value.toLowerCase());
    });

    this.setState({
      filteredItems: filteredItems,
      item: ev.target.value,
    });
  }

  handleItemClick = (ev) => {
    const maxAmountOfBuilds = 3;

    if (this.state.pickedItems.length < maxAmountOfBuilds) {
      let arr = [...this.state.pickedItems, ev.target.id];
      let formValidationString = '';

      if (arr.length < maxAmountOfBuilds) {
        formValidationString = (maxAmountOfBuilds - arr.length) + ' items are needed';
      } else if (arr.length === maxAmountOfBuilds) {
        formValidationString = ''
      }

      this.setState({
        pickedItems: arr,
        // dynamically tell the user how many items is needed
        currentDataNeededFilled: formValidationString,
        item: ''
      }, () => {
        this.props.handleChange({
          items: this.state.pickedItems
        });
      });
    }
  }

  handleRemoveItem = (ev) => {
    let arr = this.state.pickedItems.filter((item, index) => {
      return index !== Number(ev.target.id);
    });
    let maxAmountOfBuilds = 3;

    let formValidationString = '';

    if (arr.length < maxAmountOfBuilds) {
      formValidationString = (maxAmountOfBuilds - arr.length) + ' items are needed'
    } else if (arr.length === maxAmountOfBuilds) {
      formValidationString = ''
    }
  
    this.setState({
      pickedItems: arr,

      // dynamically tell the user how many items is needed
      currentDataNeededFilled: formValidationString
    }, () => {
      this.props.handleChange({
        items: this.state.pickedItems
      });
    });
  }

  displaySingleItem = (item) => {
    const itemIcon = require(`../../assets/item-icons/${item.lookUp}.png`);

    return (
      <img className={classes['images__image']} onClick={this.handleItemClick} id={item.lookUp} key={item.display} src={itemIcon} alt={item.display} />
    )
  }

  render () {
    let items = null;
    if (this.state.item === '') {
      items = this.state.items.map(this.displaySingleItem);
    } else if (this.state.filteredItems.length) {
      items = this.state.filteredItems.map(this.displaySingleItem)
    } else {
      items = null;
    }

    let itemIcons = null;

    if (this.state.pickedItems.length) {
      itemIcons = this.state.pickedItems.map((item, index) => {
        const itemIcon = require(`../../assets/item-icons/${item}.png`);
        return (
          <img className={classes['images__picked']} onClick={this.handleRemoveItem} key={index} id={index} src={itemIcon} alt={item} />
        );
      })
    } else {
      itemIcons = null;
    }

    return (
      <React.Fragment>
        <div className={classes['form__group']}>
          <label className={ classes['form__label'] } htmlFor='item'>Item</label>
          <input
            id='item'
            type='text'
            className={classes['form__input']}
            placeholder='Item Name'
            onChange={this.handleChange}
            value={this.state.item} />
            { itemIcons }
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
              <p className={classes['error']}>at most 3 items are needed</p> :
              null
          }
          <section className={classes['images']}>
            { items }
          </section>
        </div>
      </React.Fragment>
    );
  }
}

export default ItemsFormBuild;