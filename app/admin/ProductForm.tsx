import { saveAdminProductAction } from "./actions";
import {
  AdminSubmitButton,
  ArchiveProductButton,
  DeleteProductButton,
  ReactivateProductButton,
} from "./AdminFormButtons";
import {
  productGenders,
  productStatuses,
  type AdminProduct,
} from "@/lib/admin";

type SizeInput = {
  id: string;
  label: string;
};

export function ProductForm({
  error,
  product,
  saved,
  sizes,
}: Readonly<{
  error?: string;
  product?: AdminProduct | null;
  saved?: string;
  sizes: SizeInput[];
}>) {
  return (
    <form
      action={saveAdminProductAction}
      className="grid gap-10 text-[9px] uppercase tracking-[0.16em] lg:grid-cols-[1fr_420px]"
      encType="multipart/form-data"
    >
      {product ? (
        <input name="existing_id" type="hidden" value={product.id} />
      ) : null}

      <div className="grid gap-7">
        <AdminField
          defaultValue={product?.name ?? ""}
          label="Name"
          name="name"
          required
        />
        <AdminField
          defaultValue={product?.slug ?? ""}
          label="Slug"
          name="slug"
          required
        />
        <AdminField
          defaultValue={product?.description ?? ""}
          label="Description"
          name="description"
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminField
            defaultValue={product?.category ?? ""}
            label="Category"
            name="category"
            required
          />
          <AdminField
            defaultValue={product?.collection_name ?? "Spring 2026"}
            label="Collection"
            name="collection_name"
            required
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminField
            defaultValue={String(product?.price ?? 0)}
            label="Price"
            name="price"
            required
            type="number"
          />
          <AdminField
            defaultValue={product?.currency ?? "USD"}
            label="Currency"
            name="currency"
            required
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminSelect
            defaultValue={product?.gender ?? "unisex"}
            label="Gender"
            name="gender"
            options={productGenders}
          />
          <AdminSelect
            defaultValue={product?.status ?? "draft"}
            label="Status"
            name="status"
            options={productStatuses}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminField
            defaultValue={product?.color ?? ""}
            label="Color"
            name="color"
          />
          <AdminField
            defaultValue={product?.material ?? ""}
            label="Material"
            name="material"
          />
        </div>
        <label className="grid gap-3 border-b border-black/16 pb-3 text-black/64 focus-within:border-black/42">
          <span>Product images / one URL per line / line order controls gallery order</span>
          <textarea
            className="min-h-28 resize-y bg-transparent py-1 text-[12px] uppercase leading-[1.7] tracking-[0.12em] text-black outline-none"
            defaultValue={(product?.images ?? [])
              .map((image) => image.image_url)
              .join("\n")}
            name="images"
          />
        </label>
        <label className="grid gap-3 border-b border-black/16 pb-3 text-black/64 focus-within:border-black/42">
          <span>Upload images / JPG, PNG or WebP / max 8 MB each</span>
          <input
            accept="image/jpeg,image/png,image/webp"
            className="min-h-11 py-2 text-[11px] normal-case tracking-normal"
            multiple
            name="image_files"
            type="file"
          />
        </label>

        {saved ? (
          <p
            className="fixed bottom-4 right-4 z-50 border border-black/18 bg-[#171614] px-5 py-4 text-[#ecece5] shadow-lg"
            role="status"
          >
            Product saved.
          </p>
        ) : null}
        {error ? <p className="text-black/58">{error}</p> : null}

        <AdminSubmitButton
          className="w-full border border-black bg-[#171614] px-6 py-5 text-[#ecece5] sm:w-fit"
        >
          Save product →
        </AdminSubmitButton>
      </div>

      <aside className="h-fit border border-black/16 p-6">
        <p className="border-b border-black/16 pb-5 text-black/72">
          Variants and stock
        </p>
        <div className="divide-y divide-black/12">
          {sizes.map((size) => {
            const variant = product?.variants.find(
              (item) => item.size_label === size.label,
            );

            return (
              <div className="grid gap-4 py-5" key={size.id}>
                <p>{size.label}</p>
                <AdminField
                  defaultValue={String(variant?.stock ?? 0)}
                  label="Stock"
                  name={`stock_${size.id}`}
                  required
                  type="number"
                />
                <AdminSelect
                  defaultValue={variant?.status ?? "active"}
                  label="Variant status"
                  name={`variant_status_${size.id}`}
                  options={productStatuses}
                />
              </div>
            );
          })}
        </div>

        {product ? (
          <div className="mt-6 grid gap-4 border-t border-black/16 pt-6">
            <ArchiveProductButton />
            <ReactivateProductButton />
            <DeleteProductButton />
          </div>
        ) : null}
      </aside>
    </form>
  );
}

function AdminField({
  defaultValue,
  label,
  name,
  required,
  type = "text",
}: Readonly<{
  defaultValue: string;
  label: string;
  name: string;
  required?: boolean;
  type?: string;
}>) {
  return (
    <label className="grid gap-3 border-b border-black/16 pb-3 text-black/64 focus-within:border-black/42">
      <span>{label}</span>
      <input
        className="bg-transparent py-1 text-[12px] uppercase tracking-[0.12em] text-black outline-none"
        defaultValue={defaultValue}
        min={type === "number" ? 0 : undefined}
        name={name}
        required={required}
        type={type}
      />
    </label>
  );
}

function AdminSelect({
  defaultValue,
  label,
  name,
  options,
}: Readonly<{
  defaultValue: string;
  label: string;
  name: string;
  options: readonly string[];
}>) {
  return (
    <label className="grid gap-3 border-b border-black/16 pb-3 text-black/64 focus-within:border-black/42">
      <span>{label}</span>
      <select
        className="bg-transparent py-1 text-[12px] uppercase tracking-[0.12em] text-black outline-none"
        defaultValue={defaultValue}
        name={name}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
