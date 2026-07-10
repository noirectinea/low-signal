import { getAccountSession } from "@/lib/account";

export async function GET() {
  const session = await getAccountSession();

  if (!session) {
    return Response.json({
      authenticated: false,
      ok: true,
    });
  }

  return Response.json({
    authenticated: true,
    ok: true,
    profile: session.profile,
  });
}
