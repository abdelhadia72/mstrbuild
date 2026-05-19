"use client";

import { useState, useEffect } from "react";

const TARGET = new Date("2026-05-22T00:00:00").getTime();

function calc() {
  const now = Date.now();
  const diff = Math.max(0, TARGET - now);
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown() {
  const [time, setTime] = useState(calc());

  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-3 text-[#86868b]">
      <span className="text-sm">Launching in</span>
      <span className="font-mono tabular-nums text-[#f5f5f7]">
        {time.days}d {time.hours}h {time.minutes}m {time.seconds}s
      </span>
    </div>
  );
}
