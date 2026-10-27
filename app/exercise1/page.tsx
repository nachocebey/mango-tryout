"use client";
import { useEffect, useState } from "react";
import Range from "@/components/Range/Range";
import { getRange } from "@/lib/api";

export default function Exercise1() {
  const [data, setData] = useState<{ min: number; max: number }>();
  const [error, setError] = useState(false);

  useEffect(() => {
    getRange().then(setData, () => setError(true));
  }, []);

  return (
    <main>
      <h1>Normal range</h1>
      {error && <p role="alert">Could not load the range.</p>}
      {!error && !data && <p>Loading…</p>}
      {data && <Range min={data.min} max={data.max} />}
    </main>
  );
}
