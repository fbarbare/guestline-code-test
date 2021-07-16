import React from 'react';
import classNames from 'clsx';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import {
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  makeStyles,
  Typography
} from '@material-ui/core';

import useRequest from '../hooks/useRequest';

import { HotelType, RoomRatesResponse } from '../types/hotels';

import { getEnvironmentVariable } from '../envVars';

const hotelApiOrigin = getEnvironmentVariable('REACT_APP_HOTEL_API_ORIGIN');

const useStyles = makeStyles(theme => ({
  galleryImageContainer: {
    position: 'relative',
    with: '100%',
    paddingTop: '56.25%'
  },
  galleryImageInner: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto'
  },
  galleryImage: {
    objectFit: 'cover'
  },
  roomDivider: {
    margin: `${theme.spacing(2)}px 0`
  }
}));

export interface HotelProps extends HotelType {}

const Hotel: React.FC<HotelProps> = ({
  id,
  name,
  address1,
  address2,
  town,
  postcode,
  country,
  images
}) => {
  const classes = useStyles();

  const roomRatesResult = useRequest(
    RoomRatesResponse,
    `${hotelApiOrigin}/api/roomRates/OBMNG/${id}`
  );

  return (
    <Card>
      <Grid container>
        <Grid item xs={12} md={7}>
          <ImageGallery
            showPlayButton={images.length > 1}
            showBullets={images.length > 1}
            showThumbnails={false}
            autoPlay={true}
            items={images.map(({ url }) => ({ original: url }))}
            renderItem={props => (
              <div className={classes.galleryImageContainer}>
                <div className={classes.galleryImageInner}>
                  <img
                    className={classNames('image-gallery-image', classes.galleryImage)}
                    src={props.original}
                    alt={props.originalAlt}
                  />
                </div>
              </div>
            )}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <CardContent>
            <Typography variant="h2">{name}</Typography>
            <Typography variant="body1">
              {address1}, {address2}, {town}, {postcode}, {country}
            </Typography>
          </CardContent>
        </Grid>
      </Grid>
      {roomRatesResult.data && (
        <CardContent data-name="rooms">
          {roomRatesResult.data.rooms.map(({ id, name, occupancy }, index) => (
            <div key={id} data-name="room">
              {index > 0 && <Divider className={classes.roomDivider} />}

              <Typography variant="h3" gutterBottom>
                {name}
              </Typography>

              <Typography>Adults: {occupancy.maxAdult}</Typography>
              <Typography gutterBottom>Children: {occupancy.maxChildren}</Typography>
            </div>
          ))}
        </CardContent>
      )}
      {roomRatesResult.error && (
        <CardContent data-name="rooms-error">
          <Typography color="error" gutterBottom>
            There has been an error while getting the list of rooms, please try again
          </Typography>
          <Button
            color="primary"
            variant="contained"
            disableElevation
            onClick={roomRatesResult.revalidate}
          >
            Retry
          </Button>
        </CardContent>
      )}
    </Card>
  );
};

export default Hotel;
