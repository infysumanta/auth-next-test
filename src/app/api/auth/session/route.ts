import { getServerSession, createResponseWithSession } from "@/lib/session";

export async function GET() {
  const session = await getServerSession();
  const { isLoggedIn, user } = session;

  return createResponseWithSession({
    isLoggedIn,
    user: isLoggedIn ? user : undefined,
  });
}
