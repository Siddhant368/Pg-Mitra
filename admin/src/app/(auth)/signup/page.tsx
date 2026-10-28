"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { AuthAlert } from "@/components/auth/AuthAlert";
import { User, Mail, Lock } from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
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
      await fetchApi("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      
      const user = await fetchApi("/auth/me");
      setUser(user);

      if (user.role === "OWNER" || user.role === "SUPER_ADMIN") {
        router.push("/owner/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account");
      setLoading(false);
    }
  };

  const headline = (
    <>Set up your PG in <span className="text-mint-400">minutes</span></>
  );

  return (
    <AuthLayout headline={headline} subtitle="Start managing your PG in minutes">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-ink mb-2">Create your account</h2>
        <p className="text-muted">Start managing your PG in minutes</p>
      </div>

      {error && <AuthAlert>{error}</AuthAlert>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          id="name"
          type="text"
          label="Full name"
          icon={User}
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        
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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p className="text-xs text-muted mt-2 pl-2">Min 8 characters, one letter and one number</p>
        </div>
        
        <AuthButton type="submit" loading={loading}>
          Create account
        </AuthButton>
      </form>

      <AuthDivider>
        <Link href="/login" className="text-forest-600 underline font-semibold hover:text-forest-700 transition">
          Already have an account? Log in
        </Link>
      </AuthDivider>
    </AuthLayout>
  );
}
