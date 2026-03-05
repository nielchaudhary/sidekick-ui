"use client";

// Logout button is a Client Component because signOut() needs to run in the browser.
// It calls Supabase's signOut which clears the session cookies, then redirects to /login.

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();

    if (error) {
      // If signOut fails (e.g. network issue), let the user know
      // instead of silently redirecting with an active session.
      setLoading(false);
      alert("Logout failed. Please try again.");
      return;
    }

    router.push("/login");
  };

  return (
    <Button onClick={handleLogout} disabled={loading}>
      {loading ? "Logging out..." : "Log out"}
    </Button>
  );
}
