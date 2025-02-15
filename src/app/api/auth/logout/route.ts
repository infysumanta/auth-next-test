import { updateSession, createResponseWithSession } from "@/lib/session";

export async function POST() {
  try {
    // Clear session data
    await updateSession({
      isLoggedIn: false,
      user: undefined,
      accessToken: undefined,
      refreshToken: undefined,
    });

    return createResponseWithSession({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return createResponseWithSession(
      { error: "Failed to logout" },
      { status: 500 },
    );
  }
}
