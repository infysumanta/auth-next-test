import { getServerSession } from "@/lib/session";
import { Context, Next } from "hono";

export const sessionMiddleware = async (c: Context, next: Next) => {
  const session = await getServerSession();
  if (session) {
    const { accessToken, refreshToken } = session;
    if (accessToken) {
      c.req.raw.headers.set("Authorization", `Bearer ${accessToken}`);
    }
    if (refreshToken) {
      c.req.raw.headers.set("Refresh-Token", refreshToken);
    }
  }
  await next();
};
