"use client";

import { useState, useEffect, useCallback } from "react";

let toastTimeout: ReturnType<typeof setTimeout>;
let setToastState: ((msg: string, show: boolean) => void) | null = null;

export function showToast(msg: string) {
  if (setToastState) {
    setToastState(msg, true);
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      setToastState?.("", false);
    }, 2800);
  }
}

export default function Toast() {
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    setToastState = (msg: string, visible: boolean) => {
      setMessage(msg);
      setShow(visible);
    };
    return () => {
      setToastState = null;
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed bottom-8 left-1/2 z-[9999] px-5 py-3 rounded-xl text-sm flex items-center gap-2"
      style={{
        background: "var(--charcoal)",
        border: "1px solid var(--rose)",
        color: "#fff",
        transform: "translateX(-50%)",
        animation: "toastIn 0.35s ease",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ color: "var(--rose)" }}>✦</span>
      {message}
    </div>
  );
}
