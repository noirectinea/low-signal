"use server";

import { redirect } from "next/navigation";
import {
  deleteAdminProduct,
  getAdminAccess,
  saveProductFromForm,
  updateOrderStatus,
} from "@/lib/admin";

export async function saveAdminProductAction(formData: FormData) {
  const access = await getAdminAccess("/admin/products/new");

  if (!access.isAdmin) {
    redirect("/admin?denied=1");
  }

  const existingId = cleanValue(formData.get("existing_id")) || undefined;

  try {
    const productId = await saveProductFromForm(formData, existingId);
    redirect(`/admin/products/${productId}?saved=1`);
  } catch (error) {
    const target = existingId
      ? `/admin/products/${existingId}`
      : "/admin/products/new";

    redirect(
      `${target}?error=${encodeURIComponent(
        error instanceof Error ? error.message : "Product could not be saved.",
      )}`,
    );
  }
}

export async function archiveProductAction(formData: FormData) {
  formData.set("status", "archived");
  await saveAdminProductAction(formData);
}

export async function reactivateProductAction(formData: FormData) {
  formData.set("status", "active");
  await saveAdminProductAction(formData);
}

export async function deleteProductAction(formData: FormData) {
  const productId = cleanValue(formData.get("existing_id"));
  const access = await getAdminAccess(`/admin/products/${productId}`);

  if (!access.isAdmin) redirect("/admin?denied=1");

  try {
    await deleteAdminProduct(productId);
  } catch (error) {
    redirect(
      `/admin/products/${productId}?error=${encodeURIComponent(
        error instanceof Error ? error.message : "Product could not be deleted.",
      )}`,
    );
  }

  redirect("/admin/products?deleted=1");
}

export async function updateOrderStatusAction(formData: FormData) {
  const orderId = cleanValue(formData.get("order_id"));
  const status = cleanValue(formData.get("status"));
  const access = await getAdminAccess(`/admin/orders/${orderId}`);

  if (!access.isAdmin) {
    redirect("/admin?denied=1");
  }

  try {
    await updateOrderStatus(orderId, status);
  } catch (error) {
    redirect(
      `/admin/orders/${orderId}?error=${encodeURIComponent(
        error instanceof Error ? error.message : "Order status could not be saved.",
      )}`,
    );
  }

  redirect(`/admin/orders/${orderId}?saved=1`);
}

function cleanValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}
