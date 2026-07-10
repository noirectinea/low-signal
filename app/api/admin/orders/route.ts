import { requireAdmin } from "../products/route";
import { isSupabaseConfigured, supabaseRest } from "@/lib/supabase";

export async function GET(request: Request) {
  const authError = requireAdmin(request);

  if (authError) {
    return authError;
  }

  if (!isSupabaseConfigured) {
    return Response.json({
      mode: "local",
      orders: [],
    });
  }

  const orders = await supabaseRest(
    "orders?select=*,order_items(*)&order=created_at.desc",
    {
      requireServiceRole: true,
    },
  );

  return Response.json({
    mode: "supabase",
    orders: orders ?? [],
  });
}
