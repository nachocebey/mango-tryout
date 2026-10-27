async function get<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request to ${url} failed (${res.status})`);
  return res.json();
}

export const getRange = () => get<{ min: number; max: number }>('/api/range');
export const getFixedRange = () => get<{ rangeValues: number[] }>('/api/fixed-range');
