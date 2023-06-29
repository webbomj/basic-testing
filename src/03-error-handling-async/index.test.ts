import {
  rejectCustomError,
  resolveValue,
  throwCustomError,
  throwError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    expect.assertions(1);
    await expect(resolveValue(2)).resolves.toBe(2);
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    const errorMessage = 'oh da';
    expect(() => {
      throwError(errorMessage);
    }).toThrow(errorMessage);
  });

  test('should throw error with default message if message is not provided', () => {
    const errorMessage = 'Oops!';
    expect(() => {
      throwError();
    }).toThrow(errorMessage);
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    const errorMessage = 'This is my awesome custom error!';

    expect(() => {
      throwCustomError();
    }).toThrow(errorMessage);
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    const errorMessage = 'This is my awesome custom error!';

    expect.assertions(1);
    await expect(rejectCustomError()).rejects.toThrow(errorMessage);
  });
});
