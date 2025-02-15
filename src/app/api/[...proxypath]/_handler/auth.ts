import { apiServer } from "@/lib/api";
import { getServerSession, updateSession } from "@/lib/session";
import { AxiosError } from "axios";
import { Context } from "hono";
import { HTTPException } from "hono/http-exception";

export const handleLogin = async (c: Context) => {
  try {
    const { username, password } = await c.req.json();
    const { data } = await apiServer.post<LoginResponse>("/auth/login", {
      username,
      password,
      expiresInMins: 30,
    });

    await updateSession({
      isLoggedIn: true,
      user: {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        image: data.image,
      },
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });

    return c.json({
      isLoggedIn: true,
      user: {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        image: data.image,
      },
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || "Authentication failed";
      throw new HTTPException(status as 400 | 401 | 403 | 404 | 500, {
        message,
      });
    }
    throw new HTTPException(500, { message: "Internal server error" });
  }
};

export const getUserSession = async (c: Context) => {
  const session = await getServerSession();
  const { isLoggedIn, user } = session;
  return c.json({
    isLoggedIn,
    user: isLoggedIn ? user : undefined,
  });
};

export const handleLogout = async (c: Context) => {
  try {
    await updateSession({
      isLoggedIn: false,
      user: undefined,
      accessToken: undefined,
      refreshToken: undefined,
    });
    return c.json({ success: true });
  } catch {
    throw new HTTPException(500, { message: "Failed to logout" });
  }
};
