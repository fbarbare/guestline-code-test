import * as t from 'io-ts';
import { fromNullable, IntFromString } from 'io-ts-types';

export const HotelType = t.intersection([
  t.partial({
    position: t.strict({
      latitude: t.string,
      longitude: t.string,
      timezone: t.string
    })
  }),

  t.strict({
    id: t.string,
    name: t.string,
    description: t.string,
    address1: t.string,
    address2: t.string,
    postcode: t.string,
    town: t.string,
    country: t.string,
    countryCode: t.string,
    starRating: IntFromString,
    facilities: t.array(t.strict({ code: IntFromString })),
    telephone: t.string,
    email: t.string,
    images: t.array(t.strict({ url: t.string })),
    checkInHours: t.string,
    checkInMinutes: t.string,
    checkOutHours: t.string,
    checkOutMinutes: t.string
  })
]);
export interface HotelType extends t.TypeOf<typeof HotelType> {}

export const RoomType = t.strict({
  id: t.string,
  name: t.string,
  longDescription: t.string,
  images: t.array(t.strict({ url: t.string, alt: t.string })),
  bedConfiguration: t.string,
  disabledAccess: t.boolean,
  facilities: t.array(t.strict({ code: IntFromString, name: t.string })),
  occupancy: t.strict({
    maxAdult: fromNullable(t.number, 0),
    maxChildren: fromNullable(t.number, 0)
  })
});
export const RatePlanType = t.intersection([
  t.partial({
    prePaymentIsPercentage: t.boolean,
    prePaymentValue: t.number
  }),
  t.strict({
    id: t.string,
    prePayment: t.keyof({ Deposit: null, Reserve: null, 'Pay now': null, 'First night': null }),
    shortDescription: t.string
  })
]);
export const RoomRatesResponse = t.strict({
  rooms: t.array(RoomType),
  ratePlans: t.array(RatePlanType)
});
export interface RoomRatesResponse extends t.TypeOf<typeof RoomRatesResponse> {}

export const HotelsResponse = t.array(HotelType);
export interface HotelsResponse extends t.TypeOf<typeof HotelsResponse> {}
