import { describe, expect, it } from 'vitest';
import { toClockTime } from '../src/utils/time';

describe('toClockTime', () => {
  it('formats timestamp to HH:mm:ss', () => {
    const value = new Date('2026-04-07T12:34:56.000Z').getTime();
    const formatted = toClockTime(value);
    expect(formatted).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });
});
