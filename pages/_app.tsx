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

function MyApp({ Component, pageProps }: appProps) {
  const [firebaseApp, setfirebaseApp] = useState<firebase.app.App | null>(null);
  const [currentUser, setcurrentUser] = useState<firebase.User | null>(null);

  const router = useRouter();

  const [isMainLoading, setIsMainLoading] = useState(true);
  const [isComponentLoading, setisComponentLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/api/firebase_config')
      .then((res) => res.data)
      .then((data) => {
        try {
          if (data) {
            firebase.initializeApp(data);
          }
        } catch {}

        const firebase_app = firebase.app();

        if (firebase_app) {
          setfirebaseApp(firebase_app);
        }
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMainLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setisComponentLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (firebaseApp) {
      const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        setcurrentUser(user);
      });
      return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    const { pathname } = router;

    if (currentUser && notLoggedInOnlyPaths.includes(pathname)) {
      router.push('/feed');
    } else if (
      !isMainLoading &&
      !currentUser &&
      loggedInOnlyPaths.includes(pathname)
    ) {
      router.push('/login');
    }
  }, [currentUser, isMainLoading]);

  return (
    <div id="main-div">
      <CssBaseline>
        {isMainLoading ? (
          <div className="loading-div">
            <CircularProgress />
          </div>
        ) : (
          <Fragment>
            {isComponentLoading ? (
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
          </Fragment>
        )}
      </CssBaseline>
    </div>
  );
}

MyApp.propTypes = proptypes;

export default MyApp;
