"use server";

import { redirect } from "next/navigation";
import {
  requireAccountSession,
  signInWithEmail,
  signOut,
  signUpWithEmail,
  upsertCustomerProfile,
} from "@/lib/account";

export async function loginAction(formData: FormData) {
  const email = cleanValue(formData.get("email")).toLowerCase();
  const password = cleanValue(formData.get("password"));
  const next = safeNext(cleanValue(formData.get("next")) || "/account");

  const result = await signInWithEmail({
    email,
    password,
  });

  if (!result.ok) {
    redirect(
      `/account/login?next=${encodeURIComponent(next)}&error=${encodeURIComponent(
        result.message,
      )}`,
    );
  }

  redirect(next);
}

export async function registerAction(formData: FormData) {
  const email = cleanValue(formData.get("email")).toLowerCase();
  const fullName = cleanValue(formData.get("fullName"));
  const next = safeNext(cleanValue(formData.get("next")) || "/account");
  const password = cleanValue(formData.get("password"));

  if (!email || !fullName || password.length < 6) {
    const message =
      "Enter a name, email, and password with at least 6 characters.";

    redirect(
      `/account/register?next=${encodeURIComponent(
        next,
      )}&error=${encodeURIComponent(message)}`,
    );
  }

  const result = await signUpWithEmail({
    email,
    fullName,
    password,
  });

  if (!result.ok) {
    redirect(
      `/account/register?next=${encodeURIComponent(next)}&error=${encodeURIComponent(
        result.message,
      )}`,
    );
  }

  if (!result.session) {
    redirect(
      `/account/login?next=${encodeURIComponent(next)}&registered=check-email`,
    );
  }

  redirect(next);
}

export async function logoutAction() {
  await signOut();
  redirect("/");
}

export async function updateProfileAction(formData: FormData) {
  const session = await requireAccountSession("/account/settings");

  try {
    await upsertCustomerProfile({
      default_address: cleanValue(formData.get("default_address")),
      default_city: cleanValue(formData.get("default_city")),
      default_country: cleanValue(formData.get("default_country")),
      default_postal_code: cleanValue(formData.get("default_postal_code")),
      email: session.profile.email,
      full_name: cleanValue(formData.get("full_name")),
      id: session.user.id,
      phone: cleanValue(formData.get("phone")),
    });
  } catch {
    redirect("/account/settings?error=Profile could not be saved.");
  }

  redirect("/account/settings?saved=1");
}

function cleanValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function safeNext(value: string) {
  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/account";
  }

  return value;
}
