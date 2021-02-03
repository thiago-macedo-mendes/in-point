import React, { Fragment, useEffect } from 'react';

import firebase from 'firebase/app';
import 'firebase/auth';

export default function feed() {
  const currentUser = firebase.auth().currentUser;
  return (
    <div>
      {currentUser && (
        <Fragment>
          <span></span>
        </Fragment>
      )}
    </div>
  );
}
