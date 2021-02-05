import React, { useState, useEffect, useRef, Fragment } from 'react';
import Router, { useRouter } from 'next/router';

import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

import BasicAuthInput from '../components/main/auth/BasicAuthInput';
import WarnModal from '../components/misc/WarnModal';

import styles from '../styles/authmain.module.css';

import defaultConsts from '../utils/consts';
import handleFirebaseError from '../utils/firebase/firebase_error_localizer';
import { pushToFeedIfLoggedIn } from '../utils/pages/accessHandler';

import firebase from 'firebase/app';
import 'firebase/auth';
import CenteredLoadingCircle from '../components/misc/CenteredLoadingCircle';

const { requestErrorMsg } = defaultConsts;

interface BasicAuthInfo {
  email: string;
  password: string;
}

interface props {
  currentUser: firebase.User;
}

export default function signup({ currentUser }: props) {
  const [firstName, setfirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');

  const [reqError, setreqError] = useState(false);
  const [reqErrorMsg, setreqErrorMsg] = useState(requestErrorMsg);

  const nameInput = useRef<HTMLInputElement>(null);

  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push('/login');
    }
  }, [currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setreqError(false);

    const innerSubmitHandling = async () => {
      try {
        const user = (
          await firebase.auth().createUserWithEmailAndPassword(email, password)
        ).user;

        if (user) {
          await user.updateProfile({
            displayName: `${firstName} ${lastName}`
          });
          await firebase.auth().signInWithEmailAndPassword(email, password);
          router.push('/feed');
        } else {
          setreqErrorMsg('Houve um problema ao fazer login com o usuário!');
          setreqError(true);
        }
      } catch (err) {
        handleFirebaseError(err, setreqErrorMsg);
        setreqError(true);
      }
    };

    innerSubmitHandling();
  };

  const changeBasicAuthInfo = ({ email, password }: BasicAuthInfo) => {
    setemail(email);
    setpassword(password);
  };

  // For some odd reason autofocus isn't working so i did this little workaround
  useEffect(() => {
    if (nameInput.current) {
      nameInput.current.focus();
    }
  }, []);

  return (
    <div className="padding-25-top">
      {currentUser ? (
        <CenteredLoadingCircle />
      ) : (
        <Container style={{ maxWidth: '480px' }}>
          <form method="POST" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="signup-first-name-input"
                  onChange={(e) => setfirstName(e.target.value)}
                  variant="outlined"
                  required
                  fullWidth
                  type="text"
                  label="Nome"
                  inputRef={nameInput}
                  autoComplete="fname"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="signup-last-name-input"
                  onChange={(e) => setlastName(e.target.value)}
                  variant="outlined"
                  required
                  fullWidth
                  type="text"
                  label="Sobrenome"
                  autoComplete="lname"
                />
              </Grid>
              <BasicAuthInput
                submitText="Registrar"
                stateChangerFunction={changeBasicAuthInfo}
              />
            </Grid>
          </form>
          <div className={styles.bottomLink}>
            <Link href="/login">Já tem uma conta?</Link>
          </div>
          {reqError && <WarnModal message={reqErrorMsg} />}
        </Container>
      )}
    </div>
  );
}
