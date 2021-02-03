import React, { Fragment, useState } from 'react';

import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';

import FormPostModal from '../components/misc/FormPostModal';

import firebase from 'firebase/app';
import 'firebase/auth';

export default function feed() {
  const currentUser = firebase.auth().currentUser;
  const [formPostOpen, setformPostOpen] = useState(false);

  const handleFabClick = () => {
    setformPostOpen(true);
  };

  return (
    <Fragment>
      {formPostOpen && (
        <Fragment>
          <FormPostModal open={formPostOpen} setOpen={setformPostOpen} />
        </Fragment>
      )}
      <Container style={{ width: '50vw' }}>
        <div>
          {currentUser && (
            <Fragment>
              <span>{currentUser.displayName}</span>
            </Fragment>
          )}
        </div>
      </Container>
      <AppBar position="fixed" style={{ top: 'auto', bottom: 0 }}>
        <Toolbar>
          <Fab
            color="secondary"
            aria-label="add"
            style={{
              position: 'absolute',
              zIndex: 1,
              top: -30,
              left: 0,
              right: 0,
              margin: '0 auto'
            }}
            onClick={handleFabClick}
          >
            <AddIcon />
          </Fab>
        </Toolbar>
      </AppBar>
    </Fragment>
  );
}
