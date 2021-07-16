import * as testUtils from '../testUtils';
import fetchMock from 'fetch-mock';
import { cache, SWRConfig } from 'swr';

import { getEnvironmentVariable } from '../envVars';
import { RoomRatesResponse } from '../types/hotels';

import Hotel, { HotelProps } from './Hotel';
import { IntFromString } from 'io-ts-types';

const hotelApiOrigin = getEnvironmentVariable('REACT_APP_HOTEL_API_ORIGIN');
const render = (props: HotelProps) => {
  return testUtils.render(
    <SWRConfig value={{ dedupingInterval: 0 }}>
      <Hotel {...props} />
    </SWRConfig>
  );
};

const getProps = (): HotelProps => ({
  id: 'HOTEL1',
  name: 'Hotel 1',
  description: 'Hotel 1 description',
  address1: 'Hotel 1 address 1',
  address2: 'Hotel 1 address 2',
  postcode: 'Hotel 1 postcode',
  town: 'Hotel 1 town',
  country: 'Hotel 1 country',
  countryCode: 'GB',
  starRating: '4' as any,
  facilities: [],
  telephone: '07777777777',
  email: 'hotel1@hotels.com',
  images: [],
  checkInHours: '14',
  checkInMinutes: '00',
  checkOutHours: '11',
  checkOutMinutes: '00'
});

describe('Hotel', () => {
  let roomRatesResponse: RoomRatesResponse | number;

  beforeEach(() => {
    fetchMock.get(`${hotelApiOrigin}/api/roomRates/OBMNG/HOTEL1`, () => roomRatesResponse);
  });

  afterEach(() => {
    fetchMock.reset();
    cache.clear();
  });

  it('renders an error if the call fails', async () => {
    roomRatesResponse = 500;

    const props = getProps();
    const { component, delay, unmount } = render(props);

    await delay();

    expect(component.find('div[data-name="rooms"]')).toHaveLength(0);
    expect(component.find('div[data-name="rooms-error"]')).toHaveLength(1);
    unmount();
  });

  it('renders a loader while fetching data and then the list of hotels if the call is successful', async () => {
    roomRatesResponse = { rooms: [], ratePlans: [] };

    const props = getProps();
    const { component, delay, unmount } = render(props);

    await delay();

    expect(component.find('div[data-name="rooms"]')).toHaveLength(1);
    expect(component.find('div[data-name="rooms-error"]')).toHaveLength(0);

    unmount();
  });
});
