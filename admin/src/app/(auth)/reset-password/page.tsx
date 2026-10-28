"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthAlert } from "@/components/auth/AuthAlert";
import { Lock } from "lucide-react";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState(!token ? "Invalid or missing reset token." : "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await fetchApi("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      router.push("/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
      setLoading(false);
    }
  };

  return (
    <>
      {error && <AuthAlert>{error}</AuthAlert>}
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          id="password"
          type="password"
          label="New password"
          icon={Lock}
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={!token}
        />
        
        <AuthInput
          id="confirmPassword"
          type="password"
          label="Confirm password"
          icon={Lock}
          placeholder="Re-enter new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={!token}
        />
        
        <AuthButton type="submit" loading={loading} disabled={!token}>
          Reset password
        </AuthButton>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  const headline = (
    <>Choose a strong <span className="text-mint-400">new password</span></>
  );

  return (
    <AuthLayout headline={headline} subtitle="Secure your account">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-ink mb-2">Set a new password</h2>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
