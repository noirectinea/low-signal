"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type AccountState =
  | { authenticated: false }
  | { authenticated: true; initials: string };

export function AccountHeaderLink({
  className = "",
  compact = false,
  onClick,
}: {
  className?: string;
  compact?: boolean;
  onClick?: () => void;
}) {
  const [account, setAccount] = useState<AccountState>({
    authenticated: false,
  });

  useEffect(() => {
    const controller = new AbortController();

    void fetch("/api/account/me", {
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((result: {
        authenticated?: boolean;
        profile?: { email?: string; full_name?: string | null };
      }) => {
        if (!result.authenticated) return;

        setAccount({
          authenticated: true,
          initials: getInitials(
            result.profile?.full_name,
            result.profile?.email,
          ),
        });
      })
      .catch(() => {});

    return () => controller.abort();
  }, []);

  return (
    <Link
      aria-label={account.authenticated ? "Open my account" : "Sign in"}
      className={className}
      href={account.authenticated ? "/account" : "/account/login"}
      onClick={onClick}
    >
      {account.authenticated
        ? compact
          ? account.initials
          : "Account"
        : compact
          ? "Sign in"
          : "Account"}
    </Link>
  );
}

function getInitials(name?: string | null, email?: string) {
  const words = (name ?? "").trim().split(/\s+/).filter(Boolean);

  if (words.length) {
    return words
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }

  return (email?.[0] ?? "A").toUpperCase();
}
