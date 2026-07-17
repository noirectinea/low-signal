"use client";

import { useEffect } from "react";

export function AnalyticsBridge() {
  useEffect(() => {
    const report = (type: string, detail: Record<string, unknown>) => {
      const payload = {
        detail,
        path: window.location.pathname,
        timestamp: Date.now(),
        type,
      };

      window.dispatchEvent(
        new CustomEvent("low-signal-monitoring", { detail: payload }),
      );
    };
    const onError = (event: ErrorEvent) =>
      report("frontend_error", {
        message: event.message,
        source: event.filename,
      });
    const onRejection = (event: PromiseRejectionEvent) =>
      report("unhandled_rejection", {
        message:
          event.reason instanceof Error
            ? event.reason.message
            : String(event.reason),
      });

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
