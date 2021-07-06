/**
 * this was made for when a user tries to change there email or password
 * have to reauthenticate for it to work
 * https://firebase.google.com/docs/auth/web/manage-users#re-authenticate_a_user
 */

 import React, { Component } from 'react';

import {reauthenticateUser} from '../../../store/actions/authActions';
import { connect } from 'react-redux';


import classes from './UserSettingsForms/UserSettingsForm.module.css';

 class Reauthenticate extends Component {
   state = {
     email: '',
     password: ''
   }

   handleChange = (ev) => {
     this.setState({
       [ev.target.id]: ev.target.value
     });

   }

   handleSubmit = (ev) => {
     ev.preventDefault();
     //reauthenticate user with the info
     this.props.reauthenticate(this.state);
   }

   render () {
    //  need to return some sort of jsx before pushing 
    // to a new url
     if (this.props.reauthenticateSuccess) {
       this.props.history.goBack();
       return ( <p> redirecting...</p> )
     }

     return (
       <React.Fragment>
         <div className={classes['form-container']}>
           <h2 className={classes['form__title']}>
             Reauthentication is required
           </h2>
           <p className={classes['form__description']}>
             When trying to change your account information you have to reauthenticate
          </p>
          <form onSubmit={this.handleSubmit}>
            <div className={classes['form__group']}>
              <label 
                className={classes['form__label']}
                htmlFor="email">
                Email
              </label>

              <input 
                type="email" 
                id="email" 
                className={[classes['form__input'], classes['form__input--mb']].join(' ')}
                placeholder="Email"
                onChange={this.handleChange} />
            </div>
             <div className={classes['form__group']}>
              <label
                className={classes['form__label']}
                htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className={[classes['form__input'], classes['form__input--mb']].join(' ')}
                placeholder="Password"
                onChange={this.handleChange} />
            </div>
            
            <button className={classes['button']}>
              reauthenticate
            </button>

            { this.props.authError ? <p>{ this.props.authError }</p> : null }
          </form>
         </div>

       </React.Fragment>
     )
   }
 }

 const mapStateToProps = (state) => {
   return {
     ...state,
     authError: state.auth.authError,
     reauthenticateSuccess: state.auth.reauthenticateSuccess
   }
 }

 const mapDispatchToProps = (dispatch) => {
   return {
     reauthenticate: (credentials) => {
       dispatch(reauthenticateUser(credentials));
     }
   }
 }

 export default connect(mapStateToProps, mapDispatchToProps)(Reauthenticate);