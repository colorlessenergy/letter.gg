import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Register from './container/Register/Register';
import Login from './container/Login/Login';

import Build from './container/Build/Build';

import Settings from './component/Settings/Settings.js';
import Reauthenticate from './container/Settings/UserSettings/Reauthenticate';
import BuildSettings from './container/Settings/BuildSettings/BuildSettings';
import EditBuild from './container/Settings/BuildSettings/EditBuild/EditBuild';
import UserSettings from './container/Settings/UserSettings/UserSettings';

import UserSettingsUpdateEmail from './container/Settings/UserSettings/UserSettingsForms/UpdateUserEmail';
import UserSettingsUpdatePassword from './container/Settings/UserSettings/UserSettingsForms/UpdateUserPassword';
import UserSettingsUpdateUsername from './container/Settings/UserSettings/UserSettingsForms/UpdateUserUsername';
import UserSettingsDeleteUser from './container/Settings/UserSettings/UserSettingsForms/DeleteUserAccount';


import DisplayBuild from './container/DisplayBuild/DisplayBuild';
import Home from './container/Home/Home';
import HomeNew from './container/Home/HomeNew';
import NavBar from './component/NavBar/NavBar';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Route path='/' exact component={Home} />
      <Route path='/new' exact component={HomeNew} />

      <Route path='/register' exact component={Register} />
      <Route path='/login' exact component={Login} />
      <Route path='/build/:id' exact component={DisplayBuild} />
      <Route path='/build' exact component={Build} />
      <Route path='/reauthenticate' exact component={Reauthenticate} />


      <Route path='/settings' exact component={Settings} />
      <Route path='/editbuild' exact component={BuildSettings} />
      <Route path='/editbuild/:id' exact component={EditBuild} />

      <Route path='/usersettings' exact component={UserSettings} />
      <Route path='/updateemail' exact component={UserSettingsUpdateEmail} />
      <Route path='/updatepassword' exact component={UserSettingsUpdatePassword} />
      <Route path='/updateusername' exact component={UserSettingsUpdateUsername} />
      <Route path='/deleteuser' exact component={UserSettingsDeleteUser} />
    </BrowserRouter>
  );
}

export default App;
