"use client";

// Logout button is a Client Component because signOut() needs to run in the browser.
// It calls Supabase's signOut which clears the session cookies, then redirects to /login.

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-80"
    >
      Log out
    </button>
  );
}
