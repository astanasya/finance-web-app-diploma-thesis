import { expect, test, describe } from 'vitest'
import { calculateMonthlyTarget } from '../lib/math'

describe('Goal Calculations', () => {
  test('should calculate correct monthly payment for 6 months', () => {
    const start = new Date('2024-01-01');
    const end = new Date('2024-07-01'); // 6 місяців різниці
    const result = calculateMonthlyTarget(6000, 0, start, end);
    expect(result).toBe(1000);
  });

  test('should return 0 if goal is already reached', () => {
    const result = calculateMonthlyTarget(1000, 1500, new Date(), new Date());
    expect(result).toBe(0);
  });
});