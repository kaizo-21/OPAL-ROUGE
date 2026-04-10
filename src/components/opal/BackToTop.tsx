"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-8 right-8 z-[200] w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-all hover:-translate-y-0.5"
      style={{ background: "var(--rose)" }}
      aria-label="Back to top"
    >
      <ArrowUp size={18} />
    </button>
  );
}
