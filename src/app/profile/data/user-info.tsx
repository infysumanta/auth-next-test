/* eslint-disable @next/next/no-img-element */
"use client";

import { useSession } from "@/contexts/session";

export function UserInfo() {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <div className="flex items-center space-x-4 animate-pulse">
        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
          <div className="h-3 bg-gray-200 rounded w-28"></div>
        </div>
      </div>
    );
  }

  if (!session?.isLoggedIn || !session.user) {
    return null;
  }

  const { user } = session;

  return (
    <div className="flex items-center space-x-4">
      <img
        src={user.image}
        alt={user.username}
        className="w-16 h-16 rounded-full"
      />
      <div>
        <h2 className="text-xl font-bold text-black">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-black">@{user.username}</p>
        <p className="text-black">{user.email}</p>
      </div>
    </div>
  );
}
