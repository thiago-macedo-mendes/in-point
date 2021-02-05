import React from 'react';

// @ts-ignore
import InfiniteLoadingList from 'react-simple-infinite-loading';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { CardMedia } from '@material-ui/core';

import 'firebase/firestore';

interface post {
  id: string;
  uid: string;
  title: string;
  likes: Number;
  imgURL: string;
  timestamp: Date;
}

type postsArray = Array<post>;

interface props {
  posts: postsArray;
  fetchNew: Function;
}

export default function FeedPosts({ posts, fetchNew }: props) {
  console.log(posts)
  return (
    <div style={{ display: 'flex', height: '100vh', padding: '25px' }}>
      <InfiniteLoadingList
        hasMoreItems={true}
        itemHeight={100}
        loadMoreItems={fetchNew}
      >
        {posts.map((post: post) => {
          return (
            <div key={post.id} className="center-all-div">
              <Card style={{ width: '75vw' }}>
                <CardContent>
                  <Typography variant="h5">{post.title}</Typography>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </InfiniteLoadingList>
    </div>
  );
}
