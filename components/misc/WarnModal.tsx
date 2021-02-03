import React, { useState, Fragment } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import PropTypes from 'prop-types';

const propTypes = {
  message: PropTypes.string.isRequired
};

type componentProps = PropTypes.InferProps<typeof propTypes>;

export default function WarnModal({ message }: componentProps) {
  const [errorModalOpen, seterrorModalOpen] = useState(true);

  const handleCloseErrorModal = () => {
    seterrorModalOpen(false);
  };

  return (
    <div>
      {errorModalOpen && (
        <Fragment>
          <Dialog
            open={errorModalOpen}
            onClose={handleCloseErrorModal}
            aria-labelledby="request-error-title"
            aria-describedby="request-error-description"
          >
            <DialogTitle id="request-error-title">{'Erro!'}</DialogTitle>
            <DialogContent>
              <DialogContentText id="request-error-description">
                {message}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseErrorModal} color="primary" autoFocus>
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        </Fragment>
      )}
    </div>
  );
}

WarnModal.propTypes = propTypes;
