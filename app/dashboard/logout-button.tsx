"use client";

// Logout button is a Client Component because signOut() needs to run in the browser.
// It calls Supabase's signOut which clears the session cookies, then redirects to /login.

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return <Button onClick={handleLogout}>Log out</Button>;
}
