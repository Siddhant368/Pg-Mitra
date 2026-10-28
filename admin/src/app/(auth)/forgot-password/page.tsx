"use client";

import { useState } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthAlert } from "@/components/auth/AuthAlert";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await fetchApi("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  const headline = (
    <>Locked out? We will get you <span className="text-mint-400">back in</span></>
  );

  return (
    <AuthLayout headline={headline} subtitle="Enter your email and we will send a reset link">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-ink mb-2">Forgot password?</h2>
        <p className="text-muted">Enter your email and we will send a reset link</p>
      </div>

      {success && (
        <AuthAlert type="success">
          If an account exists for {email}, you will receive a password reset link shortly.
        </AuthAlert>
      )}
      
      {error && <AuthAlert>{error}</AuthAlert>}

      {!success && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthInput
            id="email"
            type="email"
            label="Email"
            icon={Mail}
            placeholder="owner@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <AuthButton type="submit" loading={loading}>
            Send reset link
          </AuthButton>
        </form>
      )}

      <div className="mt-8 text-center">
        <Link href="/login" className="text-forest-600 font-medium hover:underline transition">
          Back to log in
        </Link>
      </div>
    </AuthLayout>
  );
}
