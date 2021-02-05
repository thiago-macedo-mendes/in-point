import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import defaultConsts from '../../../utils/consts';
import NavMenu from './NavMenu';

export default function NavBar() {
  return (
    <div>
      <AppBar position="sticky">
        <Toolbar>
          <NavMenu />
          <Typography variant="h4">{defaultConsts.appName}</Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
