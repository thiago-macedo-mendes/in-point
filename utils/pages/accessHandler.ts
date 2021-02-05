import Router from 'next/router';

import firebase from 'firebase/app';

const defaultTimeOut = 250;

function pushToLoginPageIfNotLoggedIn(currentUser: firebase.User) {
  if (!currentUser) {
    Router.push('/login');
  }
}

function pushToFeedIfLoggedIn(currentUser: firebase.User) {
  if (currentUser) {
    Router.push('/login');
  }
}

export { pushToLoginPageIfNotLoggedIn, pushToFeedIfLoggedIn };
