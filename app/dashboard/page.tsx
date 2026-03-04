// Dashboard page — a protected Server Component.
// The middleware already ensures only authenticated users can reach this page,
// but we also read the session here to display user info.

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LogoutButton from "./logout-button";

export default async function DashboardPage() {
  const supabase = await createClient();

  // getUser() makes a fresh request to the Supabase auth server to verify
  // the session. This is more secure than getSession() which only reads
  // the JWT from the cookie without verifying it.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Extra safety — redirect to login if somehow no user is found
  // (the middleware should already handle this, but defense in depth)
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">
          Logged in as <span className="font-medium text-white">{user.email}</span>
        </p>
        <LogoutButton />
      </div>
    </div>
  );
}
