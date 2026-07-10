"use client";

import { useFormStatus } from "react-dom";
import { archiveProductAction, reactivateProductAction } from "./actions";

export function AdminSubmitButton({
  children,
  className,
  pendingLabel = "Saving...",
}: Readonly<{
  children: string;
  className: string;
  pendingLabel?: string;
}>) {
  const { pending } = useFormStatus();

  return (
    <button className={className} disabled={pending} type="submit">
      {pending ? pendingLabel : children}
    </button>
  );
}

export function ArchiveProductButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="border border-black/16 px-5 py-4 text-left disabled:opacity-45"
      disabled={pending}
      formAction={archiveProductAction}
      type="submit"
      onClick={(event) => {
        if (!window.confirm("Archive this product?")) {
          event.preventDefault();
        }
      }}
    >
      {pending ? "Archiving..." : "Archive product"}
    </button>
  );
}

export function ReactivateProductButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="border border-black/16 px-5 py-4 text-left disabled:opacity-45"
      disabled={pending}
      formAction={reactivateProductAction}
      type="submit"
    >
      {pending ? "Reactivating..." : "Reactivate product"}
    </button>
  );
}
