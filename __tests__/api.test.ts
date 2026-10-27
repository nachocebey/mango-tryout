/** @jest-environment node */
import { GET as range } from '@/app/api/range/route';
import { GET as fixed } from '@/app/api/fixed-range/route';

describe('mock services', () => {
  it('/api/range returns min and max', async () => {
    expect(await range().json()).toEqual({ min: 1, max: 100 });
  });
  it('/api/fixed-range returns the options', async () => {
    expect(await fixed().json()).toEqual({ rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99] });
  });
});
