"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import "./motion-typewriter-utils/index.css";

export type TypewriterPart = {
  text: string;
  className?: string;
};

type TypewriterExampleProps = {
  text?: string;
  parts?: readonly TypewriterPart[];
  className?: string;
  speed?: number;
  startDelay?: number;
  persistCaret?: boolean;
};

const cursor = {
  background: "var(--accent)",
  width: 2,
} satisfies CSSProperties;

export function TypewriterExample({
  text = "Hello world!",
  parts,
  className,
  speed = 58,
  startDelay = 0,
  persistCaret = false,
}: TypewriterExampleProps) {
  const reduceMotion = useReducedMotion();
  const segments = useMemo<readonly TypewriterPart[]>(() => parts ?? [{ text }], [parts, text]);
  const length = useMemo(() => segments.reduce((total, part) => total + part.text.length, 0), [segments]);
  const [count, setCount] = useState(reduceMotion ? length : 0);
  const [started, setStarted] = useState(Boolean(reduceMotion));

  useEffect(() => {
    if (reduceMotion) {
      setStarted(true);
      setCount(length);
      return undefined;
    }

    setStarted(false);
    setCount(0);
    let interval: number | undefined;
    const delay = window.setTimeout(() => {
      setStarted(true);
      interval = window.setInterval(() => {
        setCount((current) => {
          if (current >= length) {
            if (interval !== undefined) window.clearInterval(interval);
            return current;
          }
          return current + 1;
        });
      }, speed);
    }, startDelay);

    return () => {
      window.clearTimeout(delay);
      if (interval !== undefined) window.clearInterval(interval);
    };
  }, [length, reduceMotion, speed, startDelay]);

  let consumed = 0;
  const complete = count >= length;

  return (
    <span className={cn("typewriter", className)} aria-label={segments.map((part) => part.text).join("")}>
      <span aria-hidden="true">
        {segments.map((part, index) => {
          const visibleLength = Math.max(0, Math.min(part.text.length, count - consumed));
          consumed += part.text.length;
          return <span key={`${part.text}-${index}`} className={part.className}>{part.text.slice(0, visibleLength)}</span>;
        })}
        {started && (!complete || persistCaret) ? (
          <motion.span
            aria-hidden="true"
            className="typewriter-caret"
            style={cursor}
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
          />
        ) : null}
      </span>
    </span>
  );
}

export default TypewriterExample;