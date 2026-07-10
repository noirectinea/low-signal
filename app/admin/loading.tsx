import { AdminChrome } from "./AdminChrome";

export default function AdminLoading() {
  return (
    <AdminChrome eyebrow="Admin / LOW SIGNAL" title="Loading dashboard">
      <div className="border-y border-black/16 py-10 text-[9px] uppercase leading-[1.8] tracking-[0.16em] text-black/64">
        Preparing admin workspace.
      </div>
    </AdminChrome>
  );
}
