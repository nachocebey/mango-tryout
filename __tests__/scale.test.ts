import { clamp, continuous, discrete } from "@/lib/scale";

describe("clamp", () => {
  it.each([
    [5, 5],
    [-1, 0],
    [11, 10],
  ])("clamp(%s) -> %s", (v, expected) => {
    expect(clamp(v, 0, 10)).toBe(expected);
  });
});

describe("continuous scale", () => {
  const s = continuous(1, 101);

  it("maps values to percent and back", () => {
    expect(s.toPercent(1)).toBe(0);
    expect(s.toPercent(51)).toBe(0.5);
    expect(s.fromPercent(0.5)).toBe(51);
  });

  it("never returns values out of bounds", () => {
    expect(s.fromPercent(-3)).toBe(1);
    expect(s.fromPercent(7)).toBe(101);
    expect(s.step(101, 1)).toBe(101);
    expect(s.step(1, -1)).toBe(1);
  });

  it("handles min === max without NaN", () => {
    expect(continuous(5, 5).toPercent(5)).toBe(0);
  });
});

describe('discrete scale', () => {
  const s = discrete([1.99, 5.99, 10.99, 30.99, 50.99, 70.99]);

  it('exposes first and last as bounds', () => {
    expect([s.min, s.max]).toEqual([1.99, 70.99]);
  });

  it('spaces options evenly', () => {
    expect(s.toPercent(1.99)).toBe(0);
    expect(s.toPercent(30.99)).toBe(0.6);
    expect(s.toPercent(70.99)).toBe(1);
  });

  it('snaps to the nearest option', () => {
    expect(s.fromPercent(0.31)).toBe(10.99);
    expect(s.fromPercent(2)).toBe(70.99);
  });

  it('steps option by option and stops at the ends', () => {
    expect(s.step(5.99, 1)).toBe(10.99);
    expect(s.step(1.99, -1)).toBe(1.99);
  });

  it('sorts unsorted input', () => {
    expect(discrete([3, 1, 2]).min).toBe(1);
  });
});

