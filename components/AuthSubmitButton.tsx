"use client";

import { useFormStatus } from "react-dom";

export function AuthSubmitButton({
  idleLabel,
  pendingLabel,
}: {
  idleLabel: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      aria-disabled={pending}
      className="add-to-cart-label mt-7 min-h-12 w-full bg-black px-5 py-4 text-[#ecece5] transition-opacity duration-300 hover:opacity-80 disabled:cursor-wait disabled:opacity-55"
      disabled={pending}
      type="submit"
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
