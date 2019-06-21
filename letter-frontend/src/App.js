import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';

import Register from './container/Register/Register'
import Login from './container/Login/Login'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <h1>
          Letter.gg
        </h1>
      </div>
      <Link to='/register'>Register</Link>
      <Link to='/login'>Login</Link>
      <Route path='/register' exact component={Register} />
      <Route path='/login' exact component={Login} />
    </BrowserRouter>
  );
}

export default App;
