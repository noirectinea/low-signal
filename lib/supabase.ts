import "server-only";

type SupabaseQueryOptions = {
  method?: "DELETE" | "GET" | "PATCH" | "POST";
  body?: unknown;
  prefer?: string;
  requireServiceRole?: boolean;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && (supabaseServiceRoleKey || supabaseAnonKey),
);

export const isSupabaseServiceConfigured = Boolean(
  supabaseUrl && supabaseServiceRoleKey,
);

export function getSupabaseRestUrl(path: string) {
  if (!supabaseUrl) {
    return null;
  }

  return `${supabaseUrl.replace(/\/$/, "")}/rest/v1/${path}`;
}

export async function supabaseRest<T>(
  path: string,
  options: SupabaseQueryOptions = {},
): Promise<T | null> {
  const url = getSupabaseRestUrl(path);
  const apiKey = options.requireServiceRole
    ? supabaseServiceRoleKey
    : supabaseServiceRoleKey ?? supabaseAnonKey;

  if (!url || !apiKey) {
    return null;
  }

  const headers: Record<string, string> = {
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
  };

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (options.prefer) {
    headers.Prefer = options.prefer;
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch(url, {
      body:
        options.body === undefined ? undefined : JSON.stringify(options.body),
      cache: "no-store",
      headers,
      method: options.method ?? "GET",
    });

    if (!response.ok) {
      const message = await response.text();

      if (shouldRetrySupabaseJwtClockSkew(response.status, message, attempt)) {
        await wait(750 * (attempt + 1));
        continue;
      }

      throw new Error(
        `Supabase request failed: ${response.status}${
          message ? ` / ${message}` : ""
        }`,
      );
    }

    if (response.status === 204) {
      return null;
    }

    const text = await response.text();

    if (!text) {
      return null;
    }

    return JSON.parse(text) as T;
  }

  return null;
}

function shouldRetrySupabaseJwtClockSkew(
  status: number,
  message: string,
  attempt: number,
) {
  return (
    attempt < 2 &&
    status === 401 &&
    (message.includes("PGRST303") || message.includes("JWT issued at future"))
  );
}

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
