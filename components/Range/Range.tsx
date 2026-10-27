"use client";
import { KeyboardEvent, PointerEvent, useMemo, useRef, useState } from "react";
import { clamp, continuous, discrete } from "@/lib/scale";

import styles from "./Range.module.css";

type Props = { min: number; max: number; values?: never } | { values: number[]; min?: never; max?: never };
type Handle = "min" | "max";

export default function Range(props: Props) {
  const scale = useMemo(() => (props.values ? discrete(props.values) : continuous(props.min, props.max)), [props.values, props.min, props.max]);
  const [sel, setSel] = useState({ min: scale.min, max: scale.max });
  const [dragging, setDragging] = useState<Handle | null>(null);
  const [last, setLast] = useState<Handle>("max");

  const track = useRef<HTMLDivElement>(null);

  const update = (handle: Handle, value: number) => {
    setLast(handle);
    setSel(handle === "min" ? { ...sel, min: clamp(value, scale.min, sel.max) } : { ...sel, max: clamp(value, sel.min, scale.max) });
  };

  const onPointerDown = (h: Handle) => (e: PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(h);
  };

  const onPointerMove = (h: Handle) => (e: PointerEvent) => {
    if (dragging !== h || !track.current) return;
    const { left, width } = track.current.getBoundingClientRect();
    update(h, scale.fromPercent((e.clientX - left) / width));
  };

  const onKeyDown = (h: Handle) => (e: KeyboardEvent) => {
    let dir: 1 | -1;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") dir = 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") dir = -1;
    else return;

    e.preventDefault();
    update(h, scale.step(sel[h], dir));
  };

  const from = scale.toPercent(sel.min) * 100;
  const to = scale.toPercent(sel.max) * 100;

  const label = (h: Handle) =>
    props.values ? (
      <span className={styles.label} data-testid={`${h}-label`}>
        {sel[h].toFixed(2)} €
      </span>
    ) : (
      <EditableValue label={`${h} value`} value={sel[h]} onCommit={(v) => update(h, v)} />
    );

  return (
    <div className={styles.range}>
      {label("min")}
      <div ref={track} className={styles.track}>
        <div className={styles.fill} style={{ left: `${from}%`, width: `${to - from}%` }} />
        {(["min", "max"] as const).map((h) => (
          <div
            key={h}
            className={styles.handle}
            data-dragging={dragging === h}
            style={{ left: `${scale.toPercent(sel[h]) * 100}%`, zIndex: last === h ? 2 : 1 }}
            onPointerDown={onPointerDown(h)}
            onPointerMove={onPointerMove(h)}
            onPointerUp={() => setDragging(null)}
            onPointerCancel={() => setDragging(null)}
            role="slider"
            tabIndex={0}
            aria-label={h === "min" ? "Minimum" : "Maximum"}
            aria-valuemin={scale.min}
            aria-valuemax={scale.max}
            aria-valuenow={sel[h]}
            onKeyDown={onKeyDown(h)}
          />
        ))}
      </div>
      {label("max")}
    </div>
  );
}

function EditableValue({ value, label, onCommit }: { value: number; label: string; onCommit: (v: number) => void }) {
  const [draft, setDraft] = useState<string | null>(null);

  const commit = () => {
    if (draft !== null && draft.trim() !== "" && !Number.isNaN(Number(draft))) onCommit(Number(draft));
    setDraft(null);
  };

  return (
    <input
      type="number"
      className={styles.label}
      aria-label={label}
      value={draft ?? value}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
    />
  );
}
