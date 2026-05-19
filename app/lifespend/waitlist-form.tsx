"use client";

import { useState } from "react";
import { joinWaitlist } from "@/app/actions/waitlist";

function getDeviceInfo(): Record<string, string> {
  if (typeof window === "undefined") return {};
  return {
    platform: navigator.platform ?? "",
    language: navigator.language ?? "",
    screen: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? "",
    cores: navigator.hardwareConcurrency?.toString() ?? "",
  };
}

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    const result = await joinWaitlist({
      email,
      device_info: getDeviceInfo(),
    });

    setStatus(result.success ? "success" : "error");
    setMessage(result.message);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <div className="flex w-full items-center rounded-full bg-[#1c1c1e] p-1">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          disabled={status === "loading" || status === "success"}
          className="h-10 flex-1 bg-transparent px-4 text-[16px] text-[#f5f5f7] outline-none placeholder:text-[#636366] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success" || !email.trim()}
          className="shrink-0 h-10 rounded-full bg-[#ff6b00] px-6 text-[15px] font-medium text-white transition-all duration-200 ease-out cursor-pointer hover:bg-[#ff7b1a] hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          {status === "loading"
            ? "Joining..."
            : status === "success"
              ? "Joined"
              : "Join Waitlist"}
        </button>
      </div>
      {message && (
        <p
          className={`mt-3 text-center text-sm ${
            status === "success" ? "text-[#34c759]" : "text-[#ff453a]"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
