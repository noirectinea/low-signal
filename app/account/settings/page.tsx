import { AccountChrome } from "../AccountChrome";
import { updateProfileAction } from "../actions";
import { requireAccountSession } from "@/lib/account";

type SettingsPageProps = {
  searchParams: Promise<{
    error?: string;
    saved?: string;
  }>;
};

export default async function AccountSettingsPage({
  searchParams,
}: SettingsPageProps) {
  const [session, params] = await Promise.all([
    requireAccountSession("/account/settings"),
    searchParams,
  ]);
  const profile = session.profile;

  return (
    <AccountChrome eyebrow="Account / Settings" title="Customer details">
      <form
        action={updateProfileAction}
        className="grid gap-7 border-t border-black/16 pt-8 text-[9px] uppercase tracking-[0.16em] lg:max-w-[760px]"
      >
        <SettingsField
          defaultValue={profile.full_name ?? ""}
          label="Full name"
          name="full_name"
          required
        />
        <SettingsField defaultValue={profile.email} label="Email" name="email" />
        <SettingsField
          defaultValue={profile.phone ?? ""}
          label="Phone"
          name="phone"
        />
        <SettingsField
          defaultValue={profile.default_address ?? ""}
          label="Default address"
          name="default_address"
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <SettingsField
            defaultValue={profile.default_city ?? ""}
            label="Default city"
            name="default_city"
          />
          <SettingsField
            defaultValue={profile.default_country ?? ""}
            label="Default country"
            name="default_country"
          />
        </div>
        <SettingsField
          defaultValue={profile.default_postal_code ?? ""}
          label="Default postal code"
          name="default_postal_code"
        />

        {params.saved ? (
          <p className="text-black/58">Profile saved.</p>
        ) : null}
        {params.error ? (
          <p className="text-black/58">{params.error}</p>
        ) : null}

        <button
          className="mt-3 w-full border border-black bg-[#171614] px-6 py-5 text-[#ecece5] sm:w-fit"
          type="submit"
        >
          Save settings →
        </button>
      </form>
    </AccountChrome>
  );
}

function SettingsField({
  defaultValue,
  label,
  name,
  required,
}: Readonly<{
  defaultValue: string;
  label: string;
  name: string;
  required?: boolean;
}>) {
  return (
    <label className="grid gap-3 border-b border-black/16 pb-3 text-black/64 focus-within:border-black/42">
      <span>{label}</span>
      <input
        className="bg-transparent py-1 text-[12px] uppercase tracking-[0.12em] text-black outline-none"
        defaultValue={defaultValue}
        name={name}
        readOnly={name === "email"}
        required={required}
      />
    </label>
  );
}
