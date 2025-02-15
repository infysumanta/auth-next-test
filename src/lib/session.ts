import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import type { SessionOptions } from "iron-session";
import { NextResponse } from "next/server";

type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
};

export interface SessionData {
  isLoggedIn: boolean;
  user?: User;
  accessToken?: string;
  refreshToken?: string;
}

export const sessionOptions: SessionOptions = {
  password:
    process.env.SESSION_PASSWORD ||
    "complex_password_at_least_32_characters_long",
  cookieName: "auth-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  },
};

export async function getServerSession() {
  const cookieStore = cookies();
  const session = await getIronSession<SessionData>(
    await cookieStore,
    sessionOptions,
  );

  if (!session.isLoggedIn) {
    session.isLoggedIn = false;
  }

  return session;
}

// Helper function to create a response with session data
export async function createResponseWithSession<
  T extends Record<string, unknown>,
>(data: T, init?: { status?: number; headers?: HeadersInit }) {
  const response = NextResponse.json(data, init);
  await getServerSession(); // This sets the session cookie
  return response;
}

// Helper function to update session data
export async function updateSession(data: {
  isLoggedIn?: boolean;
  user?: User;
  accessToken?: string;
  refreshToken?: string;
}) {
  const session = await getServerSession();

  if (data.isLoggedIn !== undefined) {
    session.isLoggedIn = data.isLoggedIn;
  }

  if (data.user) {
    session.user = data.user;
  }

  if (data.accessToken !== undefined) {
    session.accessToken = data.accessToken;
  }

  if (data.refreshToken !== undefined) {
    session.refreshToken = data.refreshToken;
  }

  await session.save();
  return session;
}
