# Guestline Code Test

## The challenge - Hotel Group Page

Your challenge is to product a page showing a list of hotels and their rooms.

Please use [React](https://reactjs.org) and (preferably) [Typescript](https://www.typescriptlang.org/) to implement this challenge as this is our platform of choice. There are no other restrictions on technology choices.

To get the information to present, you will need to query the following API:

`https://obmng.dbm.guestline.net/api/hotels?collection-id=OBMNG`

This returns a list of hotels, with an Id. The Id can be used to query this query for the room types:

`https://obmng.dbm.guestline.net/api/roomRates/OBMNG/[hotelId]` for example, `https://obmng.dbm.guestline.net/api/roomRates/OBMNG/OBMNG1`

Guests using site should be able to:

- Filter based on the star rating of the hotel, that is, given I have selected 3 stars, then I am able to see all hotels with a 3 and above rating.

- Filter based on the capacity of the room. That is, when I have selected 1 adult and 1 child then I am able to see all rooms with at least that capacity.

For other requirements, please see the attached mockup sketch. Note that the mockup attempts to show hotel images. The the URLs can be found in the response to the initial request.

## Running the project

- Make sure you installed the dependencies with `npm ci`
- Run the dev environment with `npm start`

## Running the tests

- Make sure you installed the dependencies with `npm ci`
- Run the test suite with `npm t`

## Building the project

- Make sure you installed the dependencies with `npm ci`
- build the project with `npm run build`

## Run the linting on the project

- Make sure you installed the dependencies with `npm ci`
- build the project with `npm run lint`
