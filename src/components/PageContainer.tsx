import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => {
  return {
    content: {
      margin: '0 auto',
      marginLeft: 'auto',
      marginRight: 'auto',

      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),

      height: '100%',
      width: '100%',
      maxWidth: '1400px',

      [theme.breakpoints.up('sm')]: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3)
      },
      [theme.breakpoints.up('md')]: {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4)
      }
    }
  };
});

const PageContainer: React.FC = ({ children }) => {
  const classes = useStyles();

  return <div className={classes.content}>{children}</div>;
};

export default PageContainer;
