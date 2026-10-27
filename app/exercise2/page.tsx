'use client';
import { useEffect, useState } from 'react';
import Range from '@/components/Range/Range';
import { getFixedRange } from '@/lib/api';

export default function Exercise2() {
  const [values, setValues] = useState<number[]>();
  const [error, setError] = useState(false);

  useEffect(() => {
    getFixedRange().then((d) => setValues(d.rangeValues), () => setError(true));
  }, []);

  return (
    <main>
      <h1>Fixed values range</h1>
      {error && <p role="alert">Could not load the range.</p>}
      {!error && !values && <p>Loading…</p>}
      {values && <Range values={values} />}
    </main>
  );
}
