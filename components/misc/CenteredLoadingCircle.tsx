import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

export default function CenteredLoadingCircle() {
  return (
    <div className="loading-div">
      <CircularProgress />
    </div>
  );
}
