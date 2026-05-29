"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // SAVE TOKEN
        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "role",
          data.role
        );

        // ROLE REDIRECT
        if (data.role === "officer") {
          router.push("/officer");
        } else {
          router.push("/dashboard");
        }
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);

      alert("Login failed");
    }

    setLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900 p-8 text-white">
      <div className="w-full max-w-lg rounded-3xl border border-cyan-900/20 bg-slate-900/60 p-10 backdrop-blur">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-cyan-300">
            Ocean Guard
          </h1>

          <p className="mt-4 text-slate-400">
            SDG 14 Marine Monitoring System
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-500 py-4 font-semibold text-black transition hover:bg-cyan-400"
          >
            {loading
              ? "Signing In..."
              : "Login"}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-400">
          Don&apos;t have an account?{" "}
          <button
            onClick={() =>
              router.push("/register")
            }
            className="text-cyan-300"
          >
            Register
          </button>
        </p>
      </div>
    </main>
  );
}
