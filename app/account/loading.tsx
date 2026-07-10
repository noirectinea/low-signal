import { AccountChrome } from "./AccountChrome";

export default function AccountLoading() {
  return (
    <AccountChrome eyebrow="Account" title="Loading account">
      <div className="border-y border-black/16 py-10 text-[9px] uppercase leading-[1.8] tracking-[0.16em] text-black/64">
        Preparing your account.
      </div>
    </AccountChrome>
  );
}
