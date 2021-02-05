require('dotenv').config({ path: '../.env' });

import '../styles/globals.css';

import { useEffect, useState, Fragment } from 'react';

import firebase from 'firebase/app';
import 'firebase/auth';

import FIREBASE_CONFIG from '../utils/firebase/firebase_config';

import NavBar from '../components/misc/nav/NavBar';
import CenteredLoadingCircle from '../components/misc/CenteredLoadingCircle';

import CssBaseline from '@material-ui/core/CssBaseline';

import PropTypes from 'prop-types';

const proptypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired
};

type appProps = PropTypes.InferProps<typeof proptypes>;

function App({ Component, pageProps }: appProps) {
  const [firebaseApp, setFirebaseApp] = useState<firebase.app.App | null>(null);

  const [currentUser, setcurrentUser] = useState<
    firebase.User | undefined | null
  >(undefined);

  useEffect(() => {
    if (firebase.apps.length === 0) {
      const firebase_app = firebase.initializeApp(FIREBASE_CONFIG);
      setFirebaseApp(firebase_app);
    } else if (firebaseApp) {
      firebaseApp.auth().onAuthStateChanged((user: firebase.User | null) => {
        setcurrentUser(user);
      });
    }
  }, [firebaseApp]);

  return (
    <div id="main-div">
      <CssBaseline>
        {currentUser === undefined ? (
          <CenteredLoadingCircle />
        ) : (
          <Fragment>
            <NavBar />
            <div id="root-main">
              <Component {...pageProps} currentUser={currentUser} />
            </div>
          </Fragment>
        )}
      </CssBaseline>
    </div>
  );
}

App.propTypes = proptypes;

export default App;
