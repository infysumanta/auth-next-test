import { redirect } from "next/navigation";
import LoginForm from "./login-form";
import { getServerSession } from "@/lib/session";

export default async function LoginPage() {
  const session = await getServerSession();

  if (session.isLoggedIn) {
    redirect("/profile");
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
