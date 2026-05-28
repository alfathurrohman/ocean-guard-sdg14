"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleRegister = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            ...formData,
            role: "fisherman",
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(
          "Registration successful"
        );

        router.push("/login");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);

      alert("Registration failed");
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
            Sustainable Marine Monitoring Platform
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-cyan-900/20 bg-cyan-500/10 p-4">
          <p className="text-sm text-cyan-200">
            Fisherman registration portal for
            SDG 14 marine ecosystem protection.
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="space-y-5"
        >
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4"
            required
          />

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
              ? "Registering..."
              : "Register Fisherman Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-400">
          Already have an account?{" "}
          <button
            onClick={() =>
              router.push("/login")
            }
            className="text-cyan-300"
          >
            Login
          </button>
        </p>
      </div>
    </main>
  );
}
