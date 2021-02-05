import React, { useEffect, useState, Fragment } from 'react';

import { useRouter } from 'next/router';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import firebase from 'firebase/app';
import 'firebase/auth';

export default function NavMenu() {
  const currentUser = firebase.auth().currentUser;
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const isAnchorElOpen = Boolean(anchorEl);

  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUserLogout = () => {
    firebase.auth().signOut();
    router.push('/login');
  };

  useEffect(() => {
    document.addEventListener('click', handleClose, true);

    return () => {
      document.removeEventListener('click', handleClose, true);
    };
  }, []);

  return (
    <div>
      <IconButton edge="start" color="inherit" onClick={handleClick}>
        <MenuIcon />
        <Menu anchorEl={anchorEl} open={isAnchorElOpen} onClose={handleClose}>
          <div>
            {!currentUser ? (
              <Fragment>
                <MenuItem onClick={() => router.push('/login')}>Login</MenuItem>
                <MenuItem onClick={() => router.push('signup')}>
                  Registrar
                </MenuItem>
              </Fragment>
            ) : (
              <Fragment>
                <MenuItem onClick={() => router.push('/')}>HomePage</MenuItem>
                <MenuItem onClick={handleUserLogout}>Logout</MenuItem>
              </Fragment>
            )}
          </div>
        </Menu>
      </IconButton>
    </div>
  );
}
