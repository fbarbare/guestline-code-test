import React from 'react';

import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'relative'
  },
  linearProgress: {
    position: 'absolute',
    width: '100%',
    top: 0,
    left: 0,
    zIndex: theme.zIndex.drawer + 1
  }
}));

function PageLoader() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <LinearProgress className={classes.linearProgress} color="secondary" />
    </div>
  );
}

export default PageLoader;
