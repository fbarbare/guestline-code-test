import { AppBar, makeStyles, Toolbar, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  title: {
    marginRight: theme.spacing(2),
    flexGrow: 1
  }
}));

const Layout: React.FC = ({ children }) => {
  const classes = useStyles();

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Guestline Hotels
          </Typography>
        </Toolbar>
      </AppBar>

      {children}
    </>
  );
};

export default Layout;
