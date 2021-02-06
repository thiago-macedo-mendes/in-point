import React, { useState, Fragment } from 'react';
import { useRouter } from 'next/router';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import PermMediaIcon from '@material-ui/icons/PermMedia';
import Delete from '@material-ui/icons/Delete';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import PropTypes from 'prop-types';

const propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired
};

type componentProps = PropTypes.InferProps<typeof propTypes>;

export default function FormModal({ open, setOpen }: componentProps) {
  const [title, settitle] = useState('');
  const [desc, setdesc] = useState('');

  const [imageRaw, setImageRaw] = useState<null | File>(null);
  const [imageURL, setimageURL] = useState<null | string>(null);

  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const currentUser = firebase.auth().currentUser;

    if (currentUser) {
      const { uid, displayName } = currentUser;
      const timestamp = new Date();
      const likes = 0;

      firebase
        .firestore()
        .collection('POSTS')
        .add({ uid, displayName, title, desc, timestamp, likes })
        .then((docRef) => {
          let imgname = 'null';
          let toPut: Blob = new Blob(['null'], {
            type: 'application/octet-stream'
          });

          if (imageRaw && imageURL) {
            imgname = imageRaw.name;
            toPut = imageRaw;
          }

          firebase
            .storage()
            .ref(`/POSTS/${docRef.id}/IMAGES/${imgname}`)
            .put(toPut);
        });

      handleClose();
    } else {
      router.push('/login');
    }
  };

  const handleImageSubmit = (e: React.ChangeEvent) => {
    const images = (e.target as HTMLInputElement).files;
    if (images && images.length > 0) {
      const image = images[0];

      setImageRaw(image);
      setimageURL(URL.createObjectURL(image));
    }
  };

  const handleImageRemove = () => {
    setimageURL(null);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Crie o seu post</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <DialogContentText>
              Elabore um título e uma descrição.
            </DialogContentText>
            <div>
              {imageURL && imageRaw && (
                <Fragment>
                  <IconButton onClick={handleImageRemove}>
                    <Delete />
                  </IconButton>
                  <img style={{ width: '100%' }} src={imageURL}></img>
                </Fragment>
              )}
            </div>
            <TextField
              autoFocus
              margin="dense"
              label="Título"
              type="text"
              fullWidth
              multiline
              rowsMax={1}
              inputProps={{ maxLength: 16 }}
              onChange={(e) => {
                settitle(e.target.value);
              }}
              required
            />
            <TextField
              margin="dense"
              label="Descrição"
              type="text"
              fullWidth
              multiline
              rowsMax={10}
              inputProps={{ maxLength: 160 }}
              onChange={(e) => {
                setdesc(e.target.value);
              }}
              required
            />
            <div className="center-all-div">
              <input
                accept="image/*"
                hidden
                id="raised-button-file"
                type="file"
                onChange={handleImageSubmit}
              />
              <label htmlFor="raised-button-file">
                <IconButton component="span">
                  <PermMediaIcon />
                </IconButton>
              </label>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancelar
            </Button>
            <Button color="primary" type="submit">
              Enviar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

FormModal.proptypes = propTypes;
