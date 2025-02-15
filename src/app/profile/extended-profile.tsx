"use client";

import api from "@/lib/api";
import { useEffect, useState } from "react";

interface ExtendedProfile {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

export function ExtendedProfile() {
  const [profile, setProfile] = useState<ExtendedProfile | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExtendedProfile = async () => {
      try {
        const { data } = await api.get("/api/auth/me");
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchExtendedProfile();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading extended profile...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-4">{error}</div>;
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-semibold text-gray-700 mb-4">Extended Profile</h3>
      <div className="flex items-start gap-6">
        {/* {profile.image && (
          <div className="relative w-24 h-24 rounded-full overflow-hidden">
            <Image
        //       src={profile.image}
              alt={`${profile.firstName}'s profile`}
              fill
              className="object-cover"
            />
          </div>
        )} */}
        <div className="flex-1 space-y-3">
          <div className="grid gap-2 text-sm">
            <div className="grid grid-cols-2">
              <span className="text-gray-600">Full Name:</span>
              <span className="text-gray-600">{`${profile.firstName} ${profile.lastName}`}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-600">Email:</span>
              <span className="text-gray-600">{profile.email}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-600">Username:</span>
              <span className="text-gray-600">{profile.username}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-600">Gender:</span>
              <span className="capitalize text-gray-600">{profile.gender}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
