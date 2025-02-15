import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import LogoutButton from "./logout-button";
import { UserInfo } from "./user-info";
import { SessionProvider } from "@/contexts/session";
import { ExtendedProfile } from "./extended-profile";

// Initial server-side auth check
export default async function ProfilePage() {
  const session = await getServerSession();

  // Redirect to login if not authenticated
  if (!session.isLoggedIn || !session.user) {
    redirect("/login");
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        <div className="space-y-6">
          {/* Client component using Iron Session */}
          <SessionProvider>
            <UserInfo />
          </SessionProvider>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-3">
              Account Details
            </h3>
            {/* Static server rendered content */}
            <div className="grid gap-2 text-sm">
              <div className="grid grid-cols-2">
                <span className="text-gray-600">Username:</span>
                <span className="text-gray-600">{session.user.username}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-600">Gender:</span>
                <span className="capitalize text-gray-600">
                  {session.user.gender}
                </span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-600">ID:</span>
                <span className="text-gray-600">{session.user.id}</span>
              </div>
            </div>
          </div>

          {/* Extended Profile Component */}
          <ExtendedProfile />

          <div className="pt-4 border-t">
            <LogoutButton />
          </div>
        </div>
      </div>
    </main>
  );
}
