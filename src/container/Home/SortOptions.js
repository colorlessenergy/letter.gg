import React from 'react';
import { NavLink } from 'react-router-dom';

import classes from './SortOptions.module.css';

const SortOptions = () => {
  return (
    <div className={classes.sort}>
      <p className={classes.sort__categories}>
        sort
      </p>
      <NavLink className={classes.sort__category} exact to='/' activeClassName={classes.active}>Popular</NavLink>
      <NavLink className={classes.sort__category}  exact to='/new' activeClassName={classes.active}>New</NavLink>
    </div>
  )
}

export default SortOptions;