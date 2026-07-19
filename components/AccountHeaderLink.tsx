"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function AccountHeaderLink({
  className = "",
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  const [authenticated, setAuthenticated] = useState(false);

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
        setAuthenticated(true);
      })
      .catch(() => {});

    return () => controller.abort();
  }, []);

  return (
    <Link
      aria-label={authenticated ? "Open my account" : "Sign in to account"}
      className={className}
      href={authenticated ? "/account" : "/account/login"}
      onClick={onClick}
    >
      Account
    </Link>
  );
}
