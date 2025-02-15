import { NextRequest } from "next/server";
import { updateSession, createResponseWithSession } from "@/lib/session";
import { AxiosError } from "axios";
import { apiServer } from "@/lib/api";

interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log("Login request received");
    const { username, password } = await request.json();

    // Call the dummy JSON auth API using our api client
    const { data } = await apiServer.post<LoginResponse>("/auth/login", {
      username,
      password,
      expiresInMins: 30,
    });

    console.log(data);

    // Update session data
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

    // Return success response with user data
    return createResponseWithSession({
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
    console.error("Login error:", error);

    if (error instanceof AxiosError) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || "Authentication failed";

      return createResponseWithSession({ error: message }, { status });
    }

    return createResponseWithSession(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
