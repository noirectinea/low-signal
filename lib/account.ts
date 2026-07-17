import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  isSupabaseConfigured,
  isSupabaseServiceConfigured,
  supabaseRest,
} from "@/lib/supabase";

const accessCookie = "low_signal_access_token";
const refreshCookie = "low_signal_refresh_token";
const isProduction = process.env.NODE_ENV === "production";

type AuthTokenResponse = {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  user?: SupabaseAuthUser;
};

export type SupabaseAuthUser = {
  app_metadata?: {
    role?: string;
    roles?: string[];
  };
  email?: string;
  id: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    role?: string;
    roles?: string[];
  };
};

export type CustomerProfile = {
  created_at?: string;
  default_address?: string | null;
  default_city?: string | null;
  default_country?: string | null;
  default_postal_code?: string | null;
  email: string;
  full_name?: string | null;
  id: string;
  phone?: string | null;
  updated_at?: string;
};

export type AccountOrder = {
  created_at: string;
  currency: string;
  customer_email?: string | null;
  customer_name?: string | null;
  id: string;
  notes?: string | null;
  order_items?: AccountOrderItem[];
  order_number: string;
  phone?: string | null;
  shipping_address?: string | null;
  shipping_city?: string | null;
  shipping_country?: string | null;
  shipping_postal_code?: string | null;
  status: string;
  subtotal: number;
  total: number;
};

export type AccountOrderItem = {
  color_snapshot?: string | null;
  currency_snapshot: string;
  id: string;
  line_total_snapshot?: number | null;
  material_snapshot?: string | null;
  product_id: string;
  product_name_snapshot?: string | null;
  product_slug_snapshot?: string | null;
  quantity: number;
  size_snapshot?: string | null;
  unit_price_snapshot?: number | null;
  variant_id?: string | null;
};

export type AccountSession = {
  profile: CustomerProfile;
  user: SupabaseAuthUser;
};

export type AuthResult =
  | {
      ok: true;
      session: boolean;
      user?: SupabaseAuthUser;
    }
  | {
      message: string;
      ok: false;
    };

export async function signUpWithEmail({
  email,
  fullName,
  password,
}: {
  email: string;
  fullName: string;
  password: string;
}): Promise<AuthResult> {
  const result = await authRequest<AuthTokenResponse>("signup", {
    email,
    password,
    data: {
      full_name: fullName,
    },
  });

  if (!result.ok) {
    return result;
  }

  if (result.data.user) {
    await upsertCustomerProfile({
      email,
      full_name: fullName,
      id: result.data.user.id,
    });
  }

  if (result.data.access_token && result.data.refresh_token) {
    await setAuthCookies(result.data);

    return {
      ok: true,
      session: true,
      user: result.data.user,
    };
  }

  return {
    ok: true,
    session: false,
    user: result.data.user,
  };
}

export async function signInWithEmail({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  const result = await authRequest<AuthTokenResponse>(
    "token?grant_type=password",
    {
      email,
      password,
    },
  );

  if (!result.ok) {
    return result;
  }

  await setAuthCookies(result.data);

  if (result.data.user) {
    await upsertCustomerProfile({
      email: result.data.user.email ?? email,
      full_name:
        result.data.user.user_metadata?.full_name ??
        result.data.user.user_metadata?.name,
      id: result.data.user.id,
    });
  }

  return {
    ok: true,
    session: true,
    user: result.data.user,
  };
}

export async function requestPasswordReset(email: string): Promise<AuthResult> {
  const result = await authRequest<Record<string, never>>("recover", {
    email,
  });

  if (!result.ok) return result;

  return {
    ok: true,
    session: false,
  };
}

export async function signOut() {
  const token = await getAccessToken();

  if (token) {
    await authRequest("logout", undefined, token);
  }

  await clearAuthCookies();
}

export async function getCurrentAuthUser() {
  const token = await getAccessToken();

  if (!token) {
    return null;
  }

  const result = await authGetUser(token);

  if (!result.ok) {
    return null;
  }

  return result.data;
}

export async function getAccountSession(): Promise<AccountSession | null> {
  const user = await getCurrentAuthUser();

  if (!user?.email) {
    return null;
  }

  const profile = await getOrCreateCustomerProfile(user);

  return {
    profile,
    user,
  };
}

export async function requireAccountSession(next = "/account") {
  const session = await getAccountSession();

  if (!session) {
    redirect(`/account/login?next=${encodeURIComponent(next)}`);
  }

  return session;
}

export async function getOrCreateCustomerProfile(user: SupabaseAuthUser) {
  const existing = await getCustomerProfile(user.id);

  if (existing) {
    return existing;
  }

  return upsertCustomerProfile({
    email: user.email ?? "",
    full_name:
      user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
    id: user.id,
  });
}

export async function getCustomerProfile(userId: string) {
  const rows =
    (await supabaseRest<CustomerProfile[]>(
      `customers?select=id,email,full_name,phone,default_country,default_city,default_address,default_postal_code,created_at,updated_at&id=eq.${userId}`,
      {
        requireServiceRole: true,
      },
    )) ?? [];

  return rows[0] ?? null;
}

export async function upsertCustomerProfile(
  profile: Partial<CustomerProfile> & { email: string; id: string },
) {
  if (!isSupabaseServiceConfigured) {
    throw new Error("Supabase service role is not configured.");
  }

  const existing = await getCustomerProfile(profile.id);
  const body = {
    default_address: profile.default_address ?? existing?.default_address,
    default_city: profile.default_city ?? existing?.default_city,
    default_country: profile.default_country ?? existing?.default_country,
    default_postal_code:
      profile.default_postal_code ?? existing?.default_postal_code,
    email: profile.email || existing?.email,
    full_name: profile.full_name ?? existing?.full_name,
    id: profile.id,
    phone: profile.phone ?? existing?.phone,
    updated_at: new Date().toISOString(),
  };

  if (existing) {
    const rows = await supabaseRest<CustomerProfile[]>(
      `customers?id=eq.${profile.id}`,
      {
        body,
        method: "PATCH",
        prefer: "return=representation",
        requireServiceRole: true,
      },
    );

    return rows?.[0] ?? { ...existing, ...body };
  }

  const rows = await supabaseRest<CustomerProfile[]>("customers", {
    body,
    method: "POST",
    prefer: "return=representation",
    requireServiceRole: true,
  });

  return rows?.[0] ?? (body as CustomerProfile);
}

export async function linkOrderToCustomer({
  checkoutCustomer,
  orderId,
  shipping,
  user,
}: {
  checkoutCustomer: {
    email: string;
    name: string;
    phone?: string;
  };
  orderId: string;
  shipping: {
    address: string;
    city: string;
    country: string;
    postal_code?: string;
  };
  user: SupabaseAuthUser;
}) {
  await upsertCustomerProfile({
    default_address: shipping.address,
    default_city: shipping.city,
    default_country: shipping.country,
    default_postal_code: shipping.postal_code,
    email: user.email ?? checkoutCustomer.email,
    full_name: checkoutCustomer.name,
    id: user.id,
    phone: checkoutCustomer.phone,
  });

  await supabaseRest(`orders?id=eq.${orderId}`, {
    body: {
      customer_id: user.id,
    },
    method: "PATCH",
    requireServiceRole: true,
  });
}

export async function getCustomerOrders(userId: string, limit?: number) {
  const limitQuery = limit ? `&limit=${limit}` : "";

  return (
    (await supabaseRest<AccountOrder[]>(
      `orders?select=id,order_number,status,total,currency,created_at&customer_id=eq.${userId}&order=created_at.desc${limitQuery}`,
      {
        requireServiceRole: true,
      },
    )) ?? []
  );
}

export async function getCustomerOrder(userId: string, orderId: string) {
  const rows =
    (await supabaseRest<AccountOrder[]>(
      `orders?select=id,order_number,status,subtotal,total,currency,created_at,customer_email,customer_name,phone,shipping_country,shipping_city,shipping_address,shipping_postal_code,notes,order_items(*)&id=eq.${orderId}&customer_id=eq.${userId}`,
      {
        requireServiceRole: true,
      },
    )) ?? [];

  return rows[0] ?? null;
}

async function getAccessToken() {
  const cookieStore = await cookies();

  return cookieStore.get(accessCookie)?.value ?? null;
}

async function setAuthCookies(data: AuthTokenResponse) {
  if (!data.access_token || !data.refresh_token) {
    return;
  }

  const cookieStore = await cookies();
  const maxAge = data.expires_in ?? 3600;

  cookieStore.set(accessCookie, data.access_token, {
    httpOnly: true,
    maxAge,
    path: "/",
    sameSite: "lax",
    secure: isProduction,
  });
  cookieStore.set(refreshCookie, data.refresh_token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secure: isProduction,
  });
}

async function clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.delete(accessCookie);
  cookieStore.delete(refreshCookie);
}

async function authGetUser(token: string) {
  return authRequest<SupabaseAuthUser>("user", undefined, token, "GET");
}

async function authRequest<T>(
  path: string,
  body?: unknown,
  accessToken?: string,
  method: "GET" | "POST" = "POST",
): Promise<
  | {
      data: T;
      ok: true;
    }
  | {
      message: string;
      ok: false;
    }
> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isSupabaseConfigured || !supabaseUrl || !anonKey) {
    return {
      message: "Supabase Auth is not configured.",
      ok: false,
    };
  }

  const response = await fetch(
    `${supabaseUrl.replace(/\/$/, "")}/auth/v1/${path}`,
    {
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${accessToken ?? anonKey}`,
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      method,
    },
  );

  const text = await response.text();
  const data = text ? (JSON.parse(text) as T & { msg?: string }) : null;

  if (!response.ok) {
    return {
      message:
        data && "msg" in data && data.msg
          ? data.msg
          : "Authentication request failed.",
      ok: false,
    };
  }

  return {
    data: data as T,
    ok: true,
  };
}
