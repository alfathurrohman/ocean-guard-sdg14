"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FishermanSidebar from "@/components/FishermanSidebar";

interface DashboardStats {
  vessels: number;
  reports: number;
  violations: number;
}

export default function DashboardPage() {
  const router = useRouter();

  const [stats, setStats] =
    useState<DashboardStats>({
      vessels: 0,
      reports: 0,
      violations: 0,
    });

  useEffect(() => {
    const token = localStorage.getItem(
      "token"
    );

    const role = localStorage.getItem(
      "role"
    );

    if (!token) {
      router.push("/login");

      return;
    }

    // OFFICER SHOULD NOT ACCESS
    if (role === "officer") {
      router.push("/officer");

      return;
    }

    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem(
        "token"
      );

      const response = await fetch(
        `/api/dashboard/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setStats(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900 text-white">
      <div className="flex">
        {/* SIDEBAR */}
        <FishermanSidebar />

        {/* CONTENT */}
        <section className="flex-1 p-8">
          {/* HEADER */}
          <div className="mb-10">
            <p className="text-cyan-300">
              Sustainable Ocean Monitoring
            </p>

            <h1 className="mt-3 text-5xl font-bold">
              Fisherman Dashboard
            </h1>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-400">
              Monitor fishing vessels, submit
              catch reports, track GPS
              coordinates, and support SDG 14
              marine ecosystem sustainability.
            </p>
          </div>

          {/* STATS */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* VESSELS */}
            <div className="rounded-3xl border border-cyan-900/20 bg-slate-900/60 p-8 backdrop-blur">
              <p className="text-slate-400">
                My Vessels
              </p>

              <h2 className="mt-4 text-5xl font-bold text-cyan-300">
                {stats.vessels}
              </h2>

              <p className="mt-4 text-sm text-slate-500">
                Registered fishing vessels linked
                to your account.
              </p>
            </div>

            {/* REPORTS */}
            <div className="rounded-3xl border border-cyan-900/20 bg-slate-900/60 p-8 backdrop-blur">
              <p className="text-slate-400">
                Catch Reports
              </p>

              <h2 className="mt-4 text-5xl font-bold text-cyan-300">
                {stats.reports}
              </h2>

              <p className="mt-4 text-sm text-slate-500">
                Fishing activity reports submitted
                through the Ocean Guard platform.
              </p>
            </div>

            {/* VIOLATIONS */}
            <div className="rounded-3xl border border-red-900/20 bg-red-950/30 p-8 backdrop-blur">
              <p className="text-red-300">
                Active Violations
              </p>

              <h2 className="mt-4 text-5xl font-bold text-red-300">
                {stats.violations}
              </h2>

              <p className="mt-4 text-sm text-red-200/70">
                Marine regulation violations
                related to your vessels.
              </p>
            </div>
          </div>

          {/* INFORMATION PANEL */}
          <div className="mt-10 rounded-3xl border border-cyan-900/20 bg-slate-900/60 p-8 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-widest text-cyan-300">
                  SDG 14 Marine Sustainability
                </p>

                <h2 className="mt-4 text-4xl font-bold">
                  Protecting Ocean Ecosystems
                </h2>

                <p className="mt-4 max-w-3xl text-slate-400">
                  Ocean Guard supports sustainable
                  fishing practices by integrating
                  vessel monitoring, GPS tracking,
                  and catch reporting into one
                  unified cloud platform.
                </p>
              </div>

              <div className="h-5 w-5 animate-pulse rounded-full bg-cyan-400"></div>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <button
              onClick={() =>
                router.push("/vessels")
              }
              className="rounded-3xl border border-cyan-900/20 bg-slate-900/60 p-8 text-left transition hover:bg-slate-800"
            >
              <p className="text-cyan-300">
                Vessel Management
              </p>

              <h3 className="mt-3 text-2xl font-bold">
                Manage Vessels
              </h3>

              <p className="mt-4 text-slate-400">
                Register and monitor fishing
                vessels connected to your account.
              </p>
            </button>

            <button
              onClick={() =>
                router.push("/tracking")
              }
              className="rounded-3xl border border-cyan-900/20 bg-slate-900/60 p-8 text-left transition hover:bg-slate-800"
            >
              <p className="text-cyan-300">
                GPS Tracking
              </p>

              <h3 className="mt-3 text-2xl font-bold">
                Track Vessel Location
              </h3>

              <p className="mt-4 text-slate-400">
                Submit and monitor vessel GPS
                coordinates in real time.
              </p>
            </button>

            <button
              onClick={() =>
                router.push("/catch-reports")
              }
              className="rounded-3xl border border-cyan-900/20 bg-slate-900/60 p-8 text-left transition hover:bg-slate-800"
            >
              <p className="text-cyan-300">
                Catch Reports
              </p>

              <h3 className="mt-3 text-2xl font-bold">
                Submit Fishing Reports
              </h3>

              <p className="mt-4 text-slate-400">
                Record fish catches and marine
                activity reports.
              </p>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
