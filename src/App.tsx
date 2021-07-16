import { Button, Card, CardActions, CardContent, makeStyles, Typography } from '@material-ui/core';

import Hotel from './components/Hotel';
import Layout from './components/Layout';
import PageContainer from './components/PageContainer';
import PageLoader from './components/PageLoader';

import useRequest from './hooks/useRequest';

import { HotelsResponse } from './types/hotels';

import { getEnvironmentVariable } from './envVars';

const hotelApiOrigin = getEnvironmentVariable('REACT_APP_HOTEL_API_ORIGIN');

const useStyles = makeStyles(theme => ({
  hotel: {
    marginBottom: theme.spacing(2)
  }
}));

function App() {
  const classes = useStyles();
  const hotelsResult = useRequest(
    HotelsResponse,
    `${hotelApiOrigin}/api/hotels?collection-id=OBMNG`
  );

  if (hotelsResult.isLoading) {
    return <PageLoader />;
  }
  if (hotelsResult.error || !hotelsResult.data) {
    return (
      <Layout>
        <PageContainer>
          <Card data-name="hotels-error">
            <CardContent>
              <Typography color="error" gutterBottom>
                There has been an error while getting the list of hotels, please try again
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                color="primary"
                variant="contained"
                disableElevation
                onClick={hotelsResult.revalidate}
              >
                Retry
              </Button>
            </CardActions>
          </Card>
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <section data-name="hotels">
          {hotelsResult.data.map(hotel => (
            <div key={hotel.id} className={classes.hotel} data-name="hotel">
              <Hotel {...hotel} />
            </div>
          ))}
        </section>
      </PageContainer>
    </Layout>
  );
}

export default App;
