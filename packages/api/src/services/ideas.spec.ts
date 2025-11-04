import { describe, test, expect } from 'vitest';
import type { ScoreboardMetrics } from './ideas';

describe('ScoreboardMetrics', () => {
  test('has correct structure', () => {
    const metrics: ScoreboardMetrics = {
      total_submitted: 10,
      dollar_value_approved: '5000.00',
      dollar_value_implemented: '2000.00',
    };

    expect(metrics.total_submitted).toBe(10);
    expect(metrics.dollar_value_approved).toBe('5000.00');
    expect(metrics.dollar_value_implemented).toBe('2000.00');
  });

  test('dollar values are strings', () => {
    const metrics: ScoreboardMetrics = {
      total_submitted: 0,
      dollar_value_approved: '0',
      dollar_value_implemented: '0',
    };

    expect(typeof metrics.dollar_value_approved).toBe('string');
    expect(typeof metrics.dollar_value_implemented).toBe('string');
  });
});
