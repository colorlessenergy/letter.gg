/**
 * this was made for when a user tries to change there email or password
 * have to reauthenticate for it to work
 * https://firebase.google.com/docs/auth/web/manage-users#re-authenticate_a_user
 */

 import React, { Component } from 'react';

import {reauthenticateUser} from '../../../store/actions/authActions';
import { connect } from 'react-redux';


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
         <div>
           <h2>
             ReAuthentication is required
           </h2>
           <p>because you tried to change your email or password</p>
         </div>

         <form onSubmit={this.handleSubmit}>
           <div>
             <label htmlFor="email">
               Email:
             </label>
             <input 
              type="email" 
              id="email" 
              onChange={this.handleChange} />
           </div>
           <div>
             <label htmlFor="password">
               Password:
             </label>
             <input
               type="password"
               id="password"
               onChange={this.handleChange} />
           </div>

           <button>
             reauthenticate
           </button>

           { this.props.authError ? <p>{ this.props.authError }</p> : null }
         </form>
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