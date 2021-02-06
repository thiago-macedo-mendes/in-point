import React from 'react';

// @ts-ignore
import InfiniteLoadingList from 'react-simple-infinite-loading';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import 'firebase/firestore';

interface post {
  id: string;
  uid: string;
  title: string;
  desc: string;
  likes: Number;
  imgURL: string;
  timestamp: Date;
  displayName: string;
}

type postsArray = Array<post>;

interface props {
  posts: postsArray;
  fetchNew: Function;
}

export default function FeedPosts({ posts, fetchNew }: props) {
  return (
    <div style={{ display: 'flex', height: '75vh', padding: '25px' }}>
      <InfiniteLoadingList
        hasMoreItems={true}
        itemHeight={150}
        loadMoreItems={fetchNew}
      >
        {posts.map((post: post) => {
          return (
            <div key={post.id} className="center-all-div">
              <Card style={{ width: '75vw' }}>
                <CardContent>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Typography variant="h6" style={{ alignSelf: 'end' }}>
                      de: {post.displayName}
                    </Typography>
                  </div>
                  <Typography variant="h5">{post.title}</Typography>

                  <Typography variant="body1">{post.desc}</Typography>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </InfiniteLoadingList>
    </div>
  );
}
