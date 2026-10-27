export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

interface Scale {
  min: number;
  max: number;
  toPercent: (value: number) => number;
  fromPercent: (percent: number) => number;
  step: (value: number, stepSize: number) => number;
}

export function continuous(min: number, max: number): Scale {
  return {
    min,
    max,
    toPercent: (value) => (max === min ? 0 : (value - min) / (max - min)),
    fromPercent: (percent) => Math.round(min + clamp(percent, 0, 1) * (max - min)),
    step: (value, direction) => clamp(value + direction, min, max),
  };
}

export function discrete(values: number[]): Scale {
  const sorted = [...values].sort((a, b) => a - b);
  const last = sorted.length - 1;

  const nearest = (value: number) => {
    return sorted.reduce((best, cvalue, i) => {
      const isCloser = Math.abs(cvalue - value) < Math.abs(sorted[best] - value);
      return isCloser ? i : best;
    }, 0);
  };

  return {
    min: sorted[0],
    max: sorted[last],
    toPercent: (value) => (last === 0 ? 0 : nearest(value) / last),
    fromPercent: (position) => sorted[Math.round(clamp(position, 0, 1) * last)],
    step: (value, direction) => sorted[clamp(nearest(value) + direction, 0, last)],
  };
}
