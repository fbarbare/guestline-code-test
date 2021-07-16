import { getEnvironmentVariable } from './envVars';

describe('envVars', () => {
  it('Throws an error if the environment variable does not exist', async () => {
    delete process.env.foo;

    expect(() => getEnvironmentVariable('foo')).toThrow();
  });

  it('Returns the environment variable if it is an empty string', async () => {
    process.env.foo = '';

    expect(() => getEnvironmentVariable('foo')).not.toThrow();
    expect(getEnvironmentVariable('foo')).toBe('');
  });

  it('Returns the environment variable if it exists', async () => {
    process.env.foo = 'bar';

    expect(() => getEnvironmentVariable('foo')).not.toThrow();
    expect(getEnvironmentVariable('foo')).toBe('bar');
  });
});
