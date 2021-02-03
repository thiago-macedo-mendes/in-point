import React, { useState, useEffect, useRef } from 'react';

import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import styles from '../../../styles/authinput.module.css';

const proptypes = {
  submitText: PropTypes.string,
  stateChangerFunction: PropTypes.func.isRequired,
  autoFocusEmailInput: PropTypes.bool
};

type componentProps = PropTypes.InferProps<typeof proptypes>;

export default function BasicAuthInput({
  submitText,
  stateChangerFunction,
  autoFocusEmailInput = false
}: componentProps) {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');

  const emailInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    stateChangerFunction({
      email,
      password
    });
  }, [email, password]);

  useEffect(() => {
    if (autoFocusEmailInput && emailInput.current) {
      emailInput.current.focus();
    }
  }, []);

  return (
    <div>
      <Grid container>
        <Grid item xs={12} className={styles.inputInfo}>
          <TextField
            id="basic-auth-email-input"
            onChange={(e) => setemail(e.target.value)}
            variant="outlined"
            required
            fullWidth
            label="Seu endereço e-mail"
            type="email"
            autoComplete="email"
            inputRef={emailInput}
          />
        </Grid>
        <Grid item xs={12} className={styles.inputInfo}>
          <TextField
            id="basic-auth-password-input"
            onChange={(e) => setpassword(e.target.value)}
            variant="outlined"
            required
            fullWidth
            label="Sua senha"
            type="password"
            inputProps={{ minLength: 6 }}
            autoComplete="current-password"
          />
        </Grid>
      </Grid>
      <Grid container justify="center" className={styles.inputInfo}>
        <Button type="submit" fullWidth variant="contained" color="primary">
          {submitText}
        </Button>
      </Grid>
    </div>
  );
}

BasicAuthInput.propTypes = proptypes;
