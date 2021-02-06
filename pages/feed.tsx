import React, { Fragment, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';

import CenteredLoadingCircle from '../components/misc/CenteredLoadingCircle';
import FormPostModal from '../components/misc/FormPostModal';
import FeedPosts from '../components/posts/FeedPosts';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import { Unsubscribe } from '@material-ui/icons';

interface props {
  currentUser: firebase.User;
  isUserAuth: Boolean;
}

interface post {
  id: string;
  uid: string;
  title: string;
  desc: string;
  likes: Number;
  imgURL: string;
  timestamp: Date;
  isValid: Boolean;
  displayName: string;
}

export default function feed({ currentUser }: props) {
  const [formPostOpen, setformPostOpen] = useState(false);
  const [currentPosts, setcurrentPosts] = useState<Array<post> | null>(null);

  const router = useRouter();

  const handleFabClick = () => {
    setformPostOpen(true);
  };

  useEffect(() => {
    if (currentUser) {
      const firestore = firebase.firestore();
      const storage = firebase.storage();

      const postsCollection = firestore.collection('POSTS');
      const unsubscribe = postsCollection.onSnapshot(
        (querySnapshot) => {
          let postsArray: Array<post> = [];
          querySnapshot.docs.forEach((doc) => {
            if (querySnapshot.empty) {
              return null;
            }

            const updateFeed = async () => {
              const post_data = doc.data();

              const { id } = doc;

              const {
                uid,
                title,
                desc,
                likes,
                displayName,
                timestamp
              } = post_data;

              let imgURL = 'null';

              if (false) {
                try {
                  const imageLists = await storage
                    .ref(`/POSTS/${id}/IMAGES`)
                    .list();
                  const mainIMG = imageLists.items[0];
                  imgURL = await mainIMG.getDownloadURL();
                } catch {}
              }

              let isValid = false;

              if (
                id &&
                uid &&
                title &&
                timestamp &&
                desc &&
                displayName &&
                likes !== undefined
              ) {
                isValid = true;
              }
              postsArray.push({
                id,
                uid,
                displayName,
                title,
                desc,
                imgURL,
                likes,
                timestamp,
                isValid
              });
            };
            try {
              updateFeed();
            } catch {
              console.error('Too many requests!');
            }
          });
          postsArray = postsArray.filter((post) => post.isValid);

          setcurrentPosts(postsArray);
        },
        (_err) => {
          router.push('/login');
        }
      );
      return () => unsubscribe();
    } else {
      router.push('/login');
    }
  }, []);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser]);

  return (
    <div>
      {!currentUser || !currentPosts ? (
        <CenteredLoadingCircle />
      ) : (
        <Fragment>
          {formPostOpen && (
            <FormPostModal open={formPostOpen} setOpen={setformPostOpen} />
          )}
          <div>
            <FeedPosts posts={currentPosts} />
          </div>
          <AppBar position="fixed" style={{ top: 'auto', bottom: 0 }}>
            <Toolbar>
              <Fab
                color="secondary"
                aria-label="add"
                style={{
                  position: 'absolute',
                  zIndex: 1,
                  top: -30,
                  left: 0,
                  right: 0,
                  margin: '0 auto'
                }}
                onClick={handleFabClick}
              >
                <AddIcon />
              </Fab>
            </Toolbar>
          </AppBar>
        </Fragment>
      )}
    </div>
  );
}
