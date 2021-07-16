import * as t from 'io-ts';
import { isRight } from 'fp-ts/lib/Either';

import { getErrorMessages } from './types';

describe('Types', () => {
  describe('getErrorMessages', () => {
    it('Gives an error message for boolean', () => {
      const result = t.boolean.decode('wrong');

      if (isRight(result)) throw new Error('Should not be valid');

      expect(getErrorMessages(result.left)).toEqual([
        'Invalid value supplied: "wrong". Expected: boolean'
      ]);
    });

    it('Gives an error message for number', () => {
      const result = t.number.decode('wrong');

      if (isRight(result)) throw new Error('Should not be valid');

      expect(getErrorMessages(result.left)).toEqual([
        'Invalid value supplied: "wrong". Expected: number'
      ]);
    });

    it('Gives an error message for string', () => {
      const result = t.string.decode(false);

      if (isRight(result)) throw new Error('Should not be valid');

      expect(getErrorMessages(result.left)).toEqual([
        'Invalid value supplied: false. Expected: string'
      ]);
    });

    it('Gives an error message for null', () => {
      const result = t.null.decode(false);

      if (isRight(result)) throw new Error('Should not be valid');

      expect(getErrorMessages(result.left)).toEqual([
        'Invalid value supplied: false. Expected: null'
      ]);
    });

    it('Gives an error message for undefined', () => {
      const result = t.undefined.decode(null);

      if (isRight(result)) throw new Error('Should not be valid');

      expect(getErrorMessages(result.left)).toEqual([
        'Invalid value supplied: null. Expected: undefined'
      ]);
    });

    it('Gives an error message for void', () => {
      const result = t.void.decode(null);

      if (isRight(result)) throw new Error('Should not be valid');

      expect(getErrorMessages(result.left)).toEqual([
        'Invalid value supplied: null. Expected: void'
      ]);
    });

    it('Gives an error message for literal', () => {
      const result = t.literal('foo').decode('wrong');

      if (isRight(result)) throw new Error('Should not be valid');

      expect(getErrorMessages(result.left)).toEqual([
        'Invalid value supplied: "wrong". Expected: "foo"'
      ]);
    });

    it('Gives an error message for a union', () => {
      const result = t.union([t.null, t.number]).decode('wrong');

      if (isRight(result)) throw new Error('Should not be valid');

      expect(getErrorMessages(result.left)).toEqual([
        'Invalid value supplied: "wrong". Expected: null | number'
      ]);
    });

    it('Gives an error message for an intersection', () => {
      const result = t.intersection([t.null, t.number]).decode('wrong');

      if (isRight(result)) throw new Error('Should not be valid');

      expect(getErrorMessages(result.left)).toEqual([
        'Invalid value supplied: "wrong". Expected: null | number'
      ]);
    });

    it('Gives an error message for an intersection of objects', () => {
      const result = t
        .intersection([t.strict({ foo: t.literal('foo') }), t.type({ bar: t.literal('bar') })])
        .decode({ foo: 'foo', bar: 'wrong' });

      if (isRight(result)) throw new Error('Should not be valid');

      expect(getErrorMessages(result.left)).toEqual([
        'Invalid value supplied to bar: "wrong". Expected: "bar"'
      ]);
    });

    it('Gives an error message for an object', () => {
      const result = t.type({ foo: t.literal('bar') }).decode('wrong');

      if (isRight(result)) throw new Error('Should not be valid');

      expect(getErrorMessages(result.left)).toEqual([
        'Invalid value supplied: "wrong". Expected: { foo: "bar" }'
      ]);
    });

    it('Gives an error message for an object property missing', () => {
      const result = t.type({ foo: t.literal('bar') }).decode({});

      if (isRight(result)) throw new Error('Should not be valid');

      expect(getErrorMessages(result.left)).toEqual([
        'Invalid value supplied to foo: undefined. Expected: "bar"'
      ]);
    });

    it('Gives an error message for an object property', () => {
      const result = t.type({ foo: t.literal('bar') }).decode({ foo: 'wrong' });

      if (isRight(result)) throw new Error('Should not be valid');

      expect(getErrorMessages(result.left)).toEqual([
        'Invalid value supplied to foo: "wrong". Expected: "bar"'
      ]);
    });

    it('Gives an error message for a strict object property', () => {
      const result = t.strict({ foo: t.literal('bar') }).decode({ foo: 'wrong' });

      if (isRight(result)) throw new Error('Should not be valid');

      expect(getErrorMessages(result.left)).toEqual([
        'Invalid value supplied to foo: "wrong". Expected: "bar"'
      ]);
    });

    it('Gives an error message for a deep object property', () => {
      const result = t.type({ foo: t.type({ bar: t.literal('baz') }) }).decode({
        foo: { bar: 'wrong' }
      });

      if (isRight(result)) throw new Error('Should not be valid');

      expect(getErrorMessages(result.left)).toEqual([
        'Invalid value supplied to foo.bar: "wrong". Expected: "baz"'
      ]);
    });

    it('Gives an error message for a deeper object property', () => {
      const result = t.type({ foo: t.type({ bar: t.strict({ baz: t.literal('baz') }) }) }).decode({
        foo: { bar: { baz: 'wrong' } }
      });

      if (isRight(result)) throw new Error('Should not be valid');

      expect(getErrorMessages(result.left)).toEqual([
        'Invalid value supplied to foo.bar.baz: "wrong". Expected: "baz"'
      ]);
    });

    it('Gives an error message for a deep object property as a union', () => {
      const result = t
        .type({ foo: t.type({ bar: t.strict({ baz: t.union([t.literal('baz'), t.null]) }) }) })
        .decode({
          foo: { bar: { baz: 'wrong' } }
        });

      if (isRight(result)) throw new Error('Should not be valid');

      expect(getErrorMessages(result.left)).toEqual([
        'Invalid value supplied to foo.bar.baz: "wrong". Expected: "baz" | null'
      ]);
    });

    it('Gives an error message for a deep object property as an intersection', () => {
      const result = t
        .type({
          foo: t.intersection([
            t.type({ bar: t.literal('bar') }),
            t.type({ baz: t.literal('baz') })
          ])
        })
        .decode({
          foo: { bar: 'bar', baz: 'wrong' }
        });

      if (isRight(result)) throw new Error('Should not be valid');

      expect(getErrorMessages(result.left)).toEqual([
        'Invalid value supplied to foo.baz: "wrong". Expected: "baz"'
      ]);
    });

    it('Gives an error message for an array', () => {
      const result = t.readonlyArray(t.number).decode(null);

      if (isRight(result)) throw new Error('Should not be valid');

      expect(getErrorMessages(result.left)).toEqual([
        'Invalid value supplied: null. Expected: ReadonlyArray<number>'
      ]);
    });

    it('Gives an error message for an array index', () => {
      const result = t.readonlyArray(t.number).decode(['wrong']);

      if (isRight(result)) throw new Error('Should not be valid');

      expect(getErrorMessages(result.left)).toEqual([
        'Invalid value supplied to 0: "wrong". Expected: number'
      ]);
    });

    it('Gives an error message for an array index in an object', () => {
      const result = t.type({ foo: t.readonlyArray(t.number) }).decode({ foo: ['wrong'] });

      if (isRight(result)) throw new Error('Should not be valid');

      expect(getErrorMessages(result.left)).toEqual([
        'Invalid value supplied to foo.0: "wrong". Expected: number'
      ]);
    });

    it('Gives an error message for an complex object', () => {
      const result = t
        .strict({
          foo: t.readonlyArray(
            t.strict({
              bar: t.union([
                t.strict({
                  baz: t.union([t.literal('foo'), t.literal('bar')])
                }),
                t.strict({
                  baz: t.number
                })
              ])
            })
          )
        })
        .decode({
          foo: [
            { bar: { baz: 3 } },
            { bar: { baz: 'bar' } },
            { bar: { baz: 'wrong' } },
            { bar: { baz: 'foo' } }
          ]
        });

      if (isRight(result)) throw new Error('Should not be valid');

      expect(getErrorMessages(result.left)).toEqual([
        'Invalid value supplied to foo.2.bar.baz: "wrong". Expected: "foo" | "bar" | number'
      ]);
    });
  });
});
