import * as testUtils from './testUtils';
import fetchMock from 'fetch-mock';
import { cache, SWRConfig } from 'swr';

import { getEnvironmentVariable } from './envVars';
import { HotelsResponse } from './types/hotels';

import App from './App';

const hotelApiOrigin = getEnvironmentVariable('REACT_APP_HOTEL_API_ORIGIN');
const render = () => {
  return testUtils.render(
    <SWRConfig value={{ dedupingInterval: 0 }}>
      <App />
    </SWRConfig>
  );
};

describe('App', () => {
  let hotelsResponse: HotelsResponse | number;

  beforeEach(() => {
    fetchMock.get(`${hotelApiOrigin}/api/hotels?collection-id=OBMNG`, () => hotelsResponse);
  });

  afterEach(() => {
    fetchMock.reset();
    cache.clear();
  });

  it('renders a loader while fetching data and then an error if the call fails', async () => {
    hotelsResponse = 500;

    const { component, delay, unmount } = render();

    expect(component.find('PageLoader')).toHaveLength(1);
    expect(component.find('div[data-name="hotels-error"]')).toHaveLength(0);
    expect(component.find('[data-name="hotels"]')).toHaveLength(0);

    await delay();

    expect(component.find('PageLoader')).toHaveLength(0);
    expect(component.find('div[data-name="hotels-error"]')).toHaveLength(1);
    expect(component.find('[data-name="hotels"]')).toHaveLength(0);

    unmount();
  });

  it('renders a loader while fetching data and then the list of hotels if the call is successful', async () => {
    hotelsResponse = [];

    const { component, delay, unmount } = render();

    expect(component.find('PageLoader')).toHaveLength(1);
    expect(component.find('div[data-name="hotels-error"]')).toHaveLength(0);
    expect(component.find('[data-name="hotels"]')).toHaveLength(0);

    await delay();

    expect(component.find('PageLoader')).toHaveLength(0);
    expect(component.find('div[data-name="hotels-error"]')).toHaveLength(0);
    expect(component.find('[data-name="hotels"]')).toHaveLength(1);

    unmount();
  });
});
