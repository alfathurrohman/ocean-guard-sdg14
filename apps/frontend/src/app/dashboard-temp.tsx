"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface DashboardStats {
  registered_vessels: number;
  active_reports: number;
  restricted_zones: number;
}

export default function Home() {
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // AUTH CHECK
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetchStats();

    setLoading(false);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/stats`
      );

      const data = await response.json();

      setStats(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    router.push("/login");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-cyan-300">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      <div className="flex">
        {/* SIDEBAR */}
        <aside className="min-h-screen w-72 border-r border-cyan-900/20 bg-slate-950/70 backdrop-blur">
          <div className="border-b border-cyan-900/20 p-6">
            <h1 className="text-2xl font-bold text-cyan-300">
              Ocean Guard
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              SDG 14 Monitoring System
            </p>
          </div>

          <nav className="space-y-2 p-4">
            <button className="w-full rounded-xl bg-cyan-500/20 px-4 py-3 text-left text-cyan-300">
              Dashboard
            </button>

            <button className="w-full rounded-xl px-4 py-3 text-left text-slate-300 transition hover:bg-slate-800">
              Vessels
            </button>

            <button className="w-full rounded-xl px-4 py-3 text-left text-slate-300 transition hover:bg-slate-800">
              Catch Reports
            </button>

            <button className="w-full rounded-xl px-4 py-3 text-left text-slate-300 transition hover:bg-slate-800">
              Violations
            </button>

            <button className="w-full rounded-xl px-4 py-3 text-left text-slate-300 transition hover:bg-slate-800">
              Fishing Zones
            </button>
          </nav>

          <div className="p-4">
            <button
              onClick={handleLogout}
              className="w-full rounded-xl bg-red-500/20 px-4 py-3 text-red-300 transition hover:bg-red-500/30"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-cyan-100">
              Marine Monitoring Dashboard
            </h2>

            <p className="mt-2 text-slate-400">
              Real-time fisheries ecosystem monitoring and quota management.
            </p>
          </div>

          {/* Statistic Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-cyan-900/20 bg-slate-900/60 p-6 backdrop-blur">
              <p className="text-sm text-slate-400">
                Registered Vessels
              </p>

              <h3 className="mt-4 text-5xl font-bold text-cyan-300">
                {stats?.registered_vessels ?? "..."}
              </h3>
            </div>

            <div className="rounded-3xl border border-cyan-900/20 bg-slate-900/60 p-6 backdrop-blur">
              <p className="text-sm text-slate-400">
                Active Catch Reports
              </p>

              <h3 className="mt-4 text-5xl font-bold text-cyan-300">
                {stats?.active_reports ?? "..."}
              </h3>
            </div>

            <div className="rounded-3xl border border-cyan-900/20 bg-slate-900/60 p-6 backdrop-blur">
              <p className="text-sm text-slate-400">
                Restricted Zones
              </p>

              <h3 className="mt-4 text-5xl font-bold text-cyan-300">
                {stats?.restricted_zones ?? "..."}
              </h3>
            </div>
          </div>

          {/* Monitoring Table */}
          <div className="mt-10 rounded-3xl border border-cyan-900/20 bg-slate-900/60 p-6 backdrop-blur">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-cyan-100">
                  Active Vessel Monitoring
                </h3>

                <p className="mt-1 text-slate-400">
                  Latest fishing vessel activity
                </p>
              </div>

              <button className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
                Export Data
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-left text-slate-400">
                    <th className="pb-4">Vessel</th>
                    <th className="pb-4">Captain</th>
                    <th className="pb-4">Zone</th>
                    <th className="pb-4">Catch</th>
                    <th className="pb-4">Status</th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-b border-slate-800">
                    <td className="py-4">Sea Explorer 01</td>
                    <td className="py-4">Ahmad Rizky</td>
                    <td className="py-4">Zone A-12</td>
                    <td className="py-4">420 kg</td>
                    <td className="py-4 text-emerald-400">
                      Legal
                    </td>
                  </tr>

                  <tr className="border-b border-slate-800">
                    <td className="py-4">Blue Ocean IX</td>
                    <td className="py-4">Dimas Pratama</td>
                    <td className="py-4">Zone B-04</td>
                    <td className="py-4">315 kg</td>
                    <td className="py-4 text-amber-400">
                      Monitoring
                    </td>
                  </tr>

                  <tr>
                    <td className="py-4">Nusantara Laut</td>
                    <td className="py-4">Fajar Hidayat</td>
                    <td className="py-4">Restricted Zone</td>
                    <td className="py-4">710 kg</td>
                    <td className="py-4 text-red-400">
                      Violation
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
