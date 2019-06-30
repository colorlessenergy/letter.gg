import React from 'react';
import { Link } from 'react-router-dom';


const Settings = () => {
  return (
    <div>
      <Link to='/editbuild'>build settings</Link>
      <Link to='/usersettings'>user settings</Link>
    </div>
  )
}

export default Settings;