"use client";

import Link from "next/link";

export function AccountHeaderLink({
  authenticated,
  className = "",
  onClick,
}: {
  authenticated: boolean | null;
  className?: string;
  onClick?: () => void;
}) {
  const resolved = authenticated !== null;
  const isAuthenticated = authenticated === true;

  return (
    <Link
      aria-hidden={resolved ? undefined : true}
      aria-label={
        resolved
          ? isAuthenticated
            ? "Open profile"
            : "Sign in to account"
          : undefined
      }
      className={`${className} ${resolved ? "" : "invisible"}`}
      href={isAuthenticated ? "/account" : "/account/login"}
      onClick={onClick}
      tabIndex={resolved ? undefined : -1}
    >
      {isAuthenticated ? "Profile" : "Account"}
    </Link>
  );
}
