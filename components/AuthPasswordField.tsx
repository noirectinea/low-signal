"use client";

import { useState } from "react";

export function AuthPasswordField({
  autoComplete,
  label = "Password",
  minLength,
  name = "password",
}: {
  autoComplete: string;
  label?: string;
  minLength?: number;
  name?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="mt-5 grid gap-3 border-b border-black/16 pb-3 text-black/64 focus-within:border-black/42">
      <span className="flex items-center justify-between gap-5">
        {label}
        <button
          className="min-h-11 text-[9px] text-black/54"
          type="button"
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </span>
      <input
        autoComplete={autoComplete}
        className="bg-transparent py-1 text-[16px] tracking-[0.08em] text-black outline-none"
        minLength={minLength}
        name={name}
        required
        type={visible ? "text" : "password"}
      />
    </label>
  );
}
