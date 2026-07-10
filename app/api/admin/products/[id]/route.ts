import { mapProductToRow, requireAdmin } from "../route";
import { isSupabaseConfigured, supabaseRest } from "@/lib/supabase";

type ProductAdminRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: ProductAdminRouteProps,
) {
  const authError = requireAdmin(request);

  if (authError) {
    return authError;
  }

  if (!isSupabaseConfigured) {
    return Response.json(
      { error: "Supabase is not configured for product writes." },
      { status: 501 },
    );
  }

  const { id } = await params;
  const product = await request.json();

  await supabaseRest(`products?id=eq.${encodeURIComponent(id)}`, {
    body: mapProductToRow(product),
    method: "PATCH",
    requireServiceRole: true,
  });

  return Response.json({ ok: true });
}

export async function DELETE(
  request: Request,
  { params }: ProductAdminRouteProps,
) {
  const authError = requireAdmin(request);

  if (authError) {
    return authError;
  }

  if (!isSupabaseConfigured) {
    return Response.json(
      { error: "Supabase is not configured for product writes." },
      { status: 501 },
    );
  }

  const { id } = await params;

  await supabaseRest(`products?id=eq.${encodeURIComponent(id)}`, {
    body: {
      is_active: false,
      status: "archived",
      updated_at: new Date().toISOString(),
    },
    method: "PATCH",
    requireServiceRole: true,
  });

  return Response.json({ ok: true });
}
