"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { LabelInput } from "@/components/ui/label-input";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import Link from "next/link";

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const supabase = createClient();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    setLoading(false);

    if (error) {
      // Generic message prevents user enumeration (attacker learning which emails are registered)
      setError("Unable to create account. Please try again or use a different email.");
      return;
    }

    setConfirmationSent(true);
  };

  // OAuth signup and login are the same flow — Supabase auto-creates the
  // account on first OAuth login, so we use signInWithOAuth for both.
  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      setError("Unable to sign in with Google. Please try again.");
      setGoogleLoading(false);
    }
  };

  // Show confirmation message after successful email signup
  if (confirmationSent) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
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
      <Card>
        <CardHeader>
          <CardTitle>Create your Sidekick account</CardTitle>
          <CardDescription>Enter your email below to create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSignup}>
            <FieldGroup>
              <div className="flex gap-3">
                <LabelInput
                  id="first-name"
                  label="First name"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <LabelInput
                  id="last-name"
                  label="Last name"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <LabelInput
                id="email"
                label="Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div>
                <LabelInput
                  id="password"
                  label="Password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {password.length > 0 && (
                  <ul className="flex flex-col gap-1 text-xs">
                    <svg width="0" height="0" className="absolute">
                      <defs>
                        <linearGradient id="check-gradient" x1="3" y1="7" x2="11" y2="7">
                          <stop stopColor="#ef4444" />
                          <stop offset="1" stopColor="#7f1d1d" />
                        </linearGradient>
                      </defs>
                    </svg>
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
              </div>

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
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleGoogleSignup}
                  disabled={googleLoading}
                  aria-label="Sign up with Google"
                >
                  {googleLoading ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg
                        className="animate-spin"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Signing up...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Sign up with Google
                    </span>
                  )}
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
