import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 2, b: 3, action: Action.Add, expected: 5 },
  { a: 4, b: 1, action: Action.Subtract, expected: 3 },
  { a: 4, b: 12, action: Action.Multiply, expected: 48 },
  { a: 24, b: 6, action: Action.Divide, expected: 4 },
  { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
  { a: 24, b: 6, action: 'a', expected: null },
  { a: 24, b: '6', action: Action.Add, expected: null },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    'pattern: simpleCalculator(%s) = %s',
    ({ a, b, action, expected }) => {
      expect(simpleCalculator({ a, b, action })).toBe(expected);
    },
  );
});
