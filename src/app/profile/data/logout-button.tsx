"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to logout");
      }

      // Redirect to login page after successful logout
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to logout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {loading ? "Logging out..." : "Sign Out"}
    </button>
  );
}
