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

interface props {
  currentUser: firebase.User;
  isUserAuth: Boolean;
}

interface post {
  id: string;
  uid: string;
  title: string;
  likes: Number;
  imgURL: string;
  timestamp: Date;
  isValid: Boolean;
}

export default function feed({ currentUser }: props) {
  const [formPostOpen, setformPostOpen] = useState(false);
  const [currentPosts, setcurrentPosts] = useState<Array<post> | null>(null);

  const router = useRouter();

  const handleFabClick = () => {
    setformPostOpen(true);
  };

  const fetchNewPosts = async () => {
    const firestore = firebase.firestore();
    const storage = firebase.storage();

    const postsCollection = firestore.collection('POSTS');
    const unsubscribe = postsCollection.onSnapshot((querySnapshot) => {
      const postsArray: Array<post> = [];
      querySnapshot.docs.forEach((doc) => {
        const updateFeed = async () => {
          const post_data = doc.data();

          const { id } = doc;
          const { uid, title, likes, timestamp } = post_data;

          const imageLists = await storage.ref(`/POSTS/${id}/IMAGES`).list();
          const mainIMG = imageLists.items[0];
          const imgURL = await mainIMG.getDownloadURL();

          let isValid = false;
          if (id && uid && title && timestamp && likes !== undefined) {
            isValid = true;
          }
          postsArray.push({
            id,
            uid,
            title,
            imgURL,
            likes,
            timestamp,
            isValid
          });
        };
        try {
          updateFeed();
        } catch {}
      });

      if (postsArray) {
        setcurrentPosts(postsArray);
      }
      unsubscribe();
    });
  };

  useEffect(() => {
    if (currentUser) {
      fetchNewPosts();
    } else {
      router.push('/login');
    }
  }, [currentUser]);

  return (
    <div>
      {!currentUser ? (
        <CenteredLoadingCircle />
      ) : (
        <Fragment>
          {formPostOpen && (
            <Fragment>
              <FormPostModal open={formPostOpen} setOpen={setformPostOpen} />
            </Fragment>
          )}
          <div>
            {currentPosts ? (
              <Fragment>
                <FeedPosts
                  posts={currentPosts}
                  fetchNew={() => {
                    console.log('UE');
                  }}
                />
              </Fragment>
            ) : (
              <CenteredLoadingCircle />
            )}
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
