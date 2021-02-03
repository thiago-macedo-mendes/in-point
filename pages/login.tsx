import React, { useState } from 'react';
import { useRouter } from 'next/router';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';

import BasicAuthInput from '../components/main/auth/BasicAuthInput';
import WarnModal from '../components/misc/WarnModal';

import styles from '../styles/authmain.module.css';

import defaultConsts from '../utils/consts';
import handleFirebaseError from '../utils/firebase_error_handler';

import firebase from 'firebase/app';
import 'firebase/auth';

interface BasicAuthInfo {
  email: string;
  password: string;
}

const { requestErrorMsg } = defaultConsts;

export default function LoginPage() {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [reqError, setreqError] = useState(false);
  const [reqErrorMsg, setreqErrorMsg] = useState(requestErrorMsg);

  const router = useRouter();

  const changeBasicAuthInfo = ({ email, password }: BasicAuthInfo) => {
    setemail(email);
    setpassword(password);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setreqError(false);

    const innerSubmit = async () => {
      try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        router.push('/feed');
      } catch (err) {
        handleFirebaseError(err, setreqErrorMsg);
        setreqError(true);
      }
    };

    innerSubmit();
  };

  return (
    <Container style={{ maxWidth: '480px' }}>
      <Grid container spacing={2}>
        <form method="POST" onSubmit={handleSubmit}>
          <BasicAuthInput
            submitText="Logar"
            stateChangerFunction={changeBasicAuthInfo}
            autoFocusEmailInput={true}
          />
        </form>
      </Grid>
      <Link href="/signup" className={styles.bottomLink}>
        Não tem uma conta?
      </Link>
      {reqError && <WarnModal message={reqErrorMsg} />}
    </Container>
  );
}
