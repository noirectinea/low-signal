"use client";

import { useFormStatus } from "react-dom";
import {
  archiveProductAction,
  deleteProductAction,
  reactivateProductAction,
} from "./actions";

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

export function DeleteProductButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="border border-black/28 px-5 py-4 text-left text-black/68 disabled:opacity-45"
      disabled={pending}
      formAction={deleteProductAction}
      type="submit"
      onClick={(event) => {
        if (
          !window.confirm(
            "Permanently delete this product, its images, variants, and stock?",
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      {pending ? "Deleting..." : "Delete permanently"}
    </button>
  );
}

export function ConfirmOrderStatusButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="mt-5 min-h-11 w-full bg-black px-5 py-3 text-[#ecece5] disabled:opacity-45"
      disabled={pending}
      type="submit"
      onClick={(event) => {
        if (!window.confirm("Save this order status change?")) {
          event.preventDefault();
        }
      }}
    >
      {pending ? "Updating..." : "Update status →"}
    </button>
  );
}
