require('dotenv').config({ path: '../.env' });

import '../styles/globals.css';

import { useEffect, useState, Fragment } from 'react';
import { useRouter } from 'next/router';

import firebase from 'firebase/app';
import 'firebase/auth';

import NavBar from '../components/misc/nav/NavBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import CircularProgress from '@material-ui/core/CircularProgress';

import axios from 'axios';

import PropTypes from 'prop-types';

const proptypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired
};

type appProps = PropTypes.InferProps<typeof proptypes>;

const loggedInOnlyPaths = ['/feed'];
const notLoggedInOnlyPaths = ['/login', '/signup'];

function App({ Component, pageProps }: appProps) {
  const [firebaseApp, setfirebaseApp] = useState<firebase.app.App | null>(null);
  const [currentUser, setcurrentUser] = useState<firebase.User | null>(null);

  const router = useRouter();

  const [isMainLoading, setIsMainLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/api/firebase_config')
      .then((res) => res.data)
      .then((data) => {
        if (data) {
          try {
            firebase.initializeApp(data);
          } catch {}
        }

        const firebase_app = firebase.app();

        if (firebase_app) {
          setfirebaseApp(firebase_app);
        }
      });
  }, []);

  useEffect(() => {
    if (firebaseApp) {
      firebase.auth().onAuthStateChanged((user) => {
        setcurrentUser(user);
      });
      setTimeout(() => {
        setIsMainLoading(false);
      }, 1000);
    }
  }, [firebaseApp]);

  useEffect(() => {
    const { pathname } = router;

    if (currentUser && notLoggedInOnlyPaths.includes(pathname)) {
      router.push('/feed');
    } else if (!currentUser && loggedInOnlyPaths.includes(pathname)) {
      router.push('/login');
    }
  }, [currentUser]);

  return (
    <div id="main-div">
      <CssBaseline>
        {isMainLoading ? (
          <div className="loading-div">
            <CircularProgress />
          </div>
        ) : (
          <Fragment>
            <NavBar />
            <div id="root-main">
              <Component {...pageProps} />
            </div>
          </Fragment>
        )}
      </CssBaseline>
    </div>
  );
}

App.propTypes = proptypes;

export default App;
