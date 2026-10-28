"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchApi, setAuthSession } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { AuthAlert } from "@/components/auth/AuthAlert";
import { Mail, Lock } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const authData = await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (authData?.token) {
        await setAuthSession(authData.token);
      }

      let user = authData;
      try {
        const me = await fetchApi("/auth/me");
        if (me) user = me;
      } catch (meErr) {
        console.warn("Could not fetch /auth/me, fallback to login data:", meErr);
      }

      setUser(user);
      
      if (user?.role === "OWNER" || user?.role === "SUPER_ADMIN") {
        router.push("/owner/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to log in");
      setLoading(false);
    }
  };

  const headline = (
    <>
      Run your PG without the{" "}
      <span className="text-mint-400">register book</span>
    </>
  );

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Background Hero Image */}
      <Image
        src="/images/login_image.png"
        alt="Modern PG room"
        fill
        priority
        sizes="55vw"
        className="object-cover object-[65%_center] z-0"
      />

      {/* Teal Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#064E4A] via-[#064E4A]/80 to-transparent pointer-events-none" />

      {/* Existing Login Layout */}
      <div className="relative z-20 min-h-screen">
        <AuthLayout
          headline={headline}
          subtitle="Log in to your account to continue"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-ink mb-2">
              Welcome Back 
            </h2>

            <p className="text-muted">
              Log in to your account to continue
            </p>
          </div>

          {error && <AuthAlert>{error}</AuthAlert>}

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

            <div>
              <AuthInput
                id="password"
                type="password"
                label="Password"
                icon={Lock}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="mt-2 text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-forest-600 font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <AuthButton type="submit" loading={loading}>
              Log in
            </AuthButton>

          </form>

          <AuthDivider>
            <Link
              href="/signup"
              className="text-forest-600 underline font-semibold hover:text-forest-700 transition"
            >
              New owner? Create account
            </Link>
          </AuthDivider>

        </AuthLayout>
      </div>
    </div>
  );
}
