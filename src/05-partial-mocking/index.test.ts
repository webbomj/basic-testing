import { mockOne, mockTwo, mockThree, unmockedFunction } from './index';

jest.mock('./index', () => {
  const originalModule =
    jest.requireActual<typeof import('./index')>('./index');

  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => 'mocked baz'),
    mockOne: () => 1,
    mockTwo: () => 2,
    mockThree: () => 3,
  };
});

describe('partial mocking', () => {
  afterAll(() => {
    jest.unmock('./index');
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    jest.spyOn(console, 'log');
    mockOne();
    mockTwo();
    mockThree();
    expect(console.log).toHaveBeenCalledTimes(0);
  });

  test('unmockedFunction should log into console', () => {
    jest.spyOn(console, 'log');
    unmockedFunction();
    expect(console.log).toHaveBeenCalledTimes(1);
  });
});
