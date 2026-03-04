"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // After email signup, Supabase sends a confirmation email.
  // We show a "check your email" message instead of redirecting.
  const [confirmationSent, setConfirmationSent] = useState(false);

  const passwordChecks = [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "1 uppercase letter", met: /[A-Z]/.test(password) },
    { label: "1 number", met: /\d/.test(password) },
    { label: "1 special character", met: /[^A-Za-z0-9]/.test(password) },
  ];
  const allChecksMet = passwordChecks.every((c) => c.met);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allChecksMet) {
      setError("Password does not meet all requirements.");
      return;
    }
    setError(null);
    setLoading(true);

    // signUp creates the user in Supabase and sends a confirmation email.
    // The user won't have an active session until they confirm their email.
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // The confirmation email link will redirect here after Supabase verifies it
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setConfirmationSent(true);
  };

  // OAuth signup and login are the same flow — Supabase auto-creates the
  // account on first OAuth login, so we use signInWithOAuth for both.
  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    }
  };

  // Show confirmation message after successful email signup
  if (confirmationSent) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Link href="/" className="flex items-center justify-center gap-1">
          <Image src="/favicon.png" alt="Sidekick" width={32} height={32} />
          <span className="text-white font-semibold text-xl tracking-tight">sidekick</span>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              We sent a confirmation link to <strong className="text-white">{email}</strong>. Click
              the link to activate your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldDescription className="text-center">
              Already confirmed?{" "}
              <Link href="/login" className="text-white underline-offset-4 hover:underline">
                Log in
              </Link>
            </FieldDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Link href="/" className="flex items-center justify-center gap-1">
        <Image src="/favicon.png" alt="Sidekick" width={32} height={32} />
        <span className="text-white font-semibold text-xl tracking-tight">sidekick</span>
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Enter your email below to create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSignup}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="neel@sidekick.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {password.length > 0 && (
                  <ul className="flex flex-col gap-1 text-xs">
                    {passwordChecks.map((check) => (
                      <li key={check.label} className="flex items-center gap-1.5">
                        {check.met ? (
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path
                              d="M3 7.5L5.5 10L11 4"
                              stroke="url(#check-gradient)"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <defs>
                              <linearGradient id="check-gradient" x1="3" y1="7" x2="11" y2="7">
                                <stop stopColor="#ef4444" />
                                <stop offset="1" stopColor="#7f1d1d" />
                              </linearGradient>
                            </defs>
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <circle
                              cx="7"
                              cy="7"
                              r="2.5"
                              stroke="white"
                              strokeOpacity="0.25"
                              strokeWidth="1"
                            />
                          </svg>
                        )}
                        <span className={check.met ? "text-white/70" : "text-white/30"}>
                          {check.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </Field>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <div className="flex flex-col gap-3 pt-1">
                <Button type="submit" disabled={loading || !allChecksMet}>
                  {loading ? "Creating account..." : "Sign up"}
                </Button>
                <div className="relative flex items-center py-1">
                  <div className="grow border-t border-white/10" />
                  <span className="px-3 text-xs text-white/40">or</span>
                  <div className="grow border-t border-white/10" />
                </div>
                <Button variant="outline" type="button" onClick={handleGoogleSignup}>
                  Sign up with Google
                </Button>
                <FieldDescription className="text-center pt-1">
                  Already have an account?{" "}
                  <Link href="/login" className="text-white underline-offset-4 hover:underline">
                    Log in
                  </Link>
                </FieldDescription>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
