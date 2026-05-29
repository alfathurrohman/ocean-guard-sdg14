"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OfficerSidebar from "@/components/OfficerSidebar";

interface Stats {
  vessels: number;
  reports: number;
  violations: number;
}

interface Violation {
  id: number;
  vessel_name: string;
  fisherman_name: string;
  violation_type: string;
  description: string;
  severity: string;
  status: string;
}

interface Activity {
  id: number;
  vessel_name: string;
  fisherman_name: string;
  fish_type: string;
  catch_weight: number;
  fishing_zone: string;
  activity_status: string;
  severity: string;
}

export default function OfficerDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState<Stats>({
    vessels: 0,
    reports: 0,
    violations: 0,
  });

  const [violations, setViolations] =
    useState<Violation[]>([]);

  const [activities, setActivities] =
    useState<Activity[]>([]);

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

    if (role !== "officer") {
      router.push("/dashboard");

      return;
    }

    fetchDashboardStats();

    fetchViolations();

    fetchActivities();
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

  const fetchViolations = async () => {
    try {
      const token = localStorage.getItem(
        "token"
      );

      const response = await fetch(
        `/api/violations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setViolations(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem(
        "token"
      );

      const response = await fetch(
        `/api/catch-reports`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setActivities(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-900 text-white">
      <div className="flex">
        <OfficerSidebar />

        {/* CONTENT */}
        <section className="flex-1 p-8">
          {/* HEADER */}
          <div className="mb-8">
            <p className="text-red-300">
              National Marine Surveillance
            </p>

            <h1 className="mt-3 text-5xl font-bold">
              Ocean Guard Officer Dashboard
            </h1>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-400">
              Monitor vessel activities,
              sustainable fishing quotas,
              protected marine zones, and SDG
              14 ecosystem compliance across
              national waters.
            </p>
          </div>

          {/* STATS */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-cyan-900/20 bg-slate-900/60 p-8">
              <p className="text-slate-400">
                Registered Vessels
              </p>

              <h2 className="mt-4 text-5xl font-bold text-cyan-300">
                {stats.vessels}
              </h2>
            </div>

            <div className="rounded-3xl border border-cyan-900/20 bg-slate-900/60 p-8">
              <p className="text-slate-400">
                Marine Activities
              </p>

              <h2 className="mt-4 text-5xl font-bold text-cyan-300">
                {stats.reports}
              </h2>
            </div>

            <div className="rounded-3xl border border-red-900/20 bg-red-950/30 p-8">
              <p className="text-red-300">
                Active Violations
              </p>

              <h2 className="mt-4 text-5xl font-bold text-red-300">
                {stats.violations}
              </h2>
            </div>
          </div>

          {/* ACTIVITIES */}
          <div className="mt-10 rounded-3xl border border-cyan-900/20 bg-slate-900/60 p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold">
                National Marine Activities
              </h2>

              <p className="mt-3 text-slate-400">
                Real-time sustainable fishing
                activity monitoring across all
                registered fishermen.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-left text-slate-400">
                    <th className="pb-4">
                      Vessel
                    </th>

                    <th className="pb-4">
                      Fisherman
                    </th>

                    <th className="pb-4">
                      Fish Type
                    </th>

                    <th className="pb-4">
                      Weight
                    </th>

                    <th className="pb-4">
                      Zone
                    </th>

                    <th className="pb-4">
                      Status
                    </th>

                    <th className="pb-4">
                      Severity
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {Array.isArray(
                    activities
                  ) &&
                    activities.map(
                      (activity) => (
                        <tr
                          key={activity.id}
                          className="border-b border-slate-800"
                        >
                          <td className="py-4">
                            {
                              activity.vessel_name
                            }
                          </td>

                          <td className="py-4">
                            {
                              activity.fisherman_name
                            }
                          </td>

                          <td className="py-4">
                            {
                              activity.fish_type
                            }
                          </td>

                          <td className="py-4">
                            {
                              activity.catch_weight
                            }{" "}
                            kg
                          </td>

                          <td className="py-4">
                            {
                              activity.fishing_zone
                            }
                          </td>

                          {/* STATUS */}
                          <td className="py-4">
                            <span
                              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                                activity.activity_status ===
                                "SAFE"
                                  ? "bg-green-500/20 text-green-300"

                                  : activity.activity_status ===
                                      "WARNING"
                                    ? "bg-yellow-500/20 text-yellow-300"

                                    : activity.activity_status ===
                                        "HIGH"
                                      ? "bg-orange-500/20 text-orange-300"

                                      : "bg-red-500/20 text-red-300"
                              }`}
                            >
                              {
                                activity.activity_status
                              }
                            </span>
                          </td>

                          {/* SEVERITY */}
                          <td className="py-4">
                            <span
                              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                                activity.severity ===
                                "LOW"
                                  ? "bg-green-500/20 text-green-300"

                                  : activity.severity ===
                                      "MEDIUM"
                                    ? "bg-yellow-500/20 text-yellow-300"

                                    : activity.severity ===
                                        "HIGH"
                                      ? "bg-orange-500/20 text-orange-300"

                                      : "bg-red-500/20 text-red-300"
                              }`}
                            >
                              {
                                activity.severity
                              }
                            </span>
                          </td>
                        </tr>
                      )
                    )}
                </tbody>
              </table>
            </div>
          </div>

          {/* VIOLATIONS */}
          <div className="mt-10 rounded-3xl border border-red-900/20 bg-red-950/20 p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold">
                Critical Marine Violations
              </h2>

              <p className="mt-3 text-slate-400">
                Serious marine ecosystem
                violations requiring government
                intervention.
              </p>
            </div>

            <div className="space-y-4">
              {Array.isArray(violations) &&
                violations.map(
                  (violation) => (
                    <div
                      key={violation.id}
                      className="rounded-2xl border border-red-900/20 bg-slate-900/60 p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-red-300">
                            {
                              violation.violation_type
                            }
                          </h3>

<p className="mt-2 text-slate-400">
  Vessel: {violation.vessel_name}
</p>

<p className="mt-2 text-slate-400">
  Fisherman: {violation.fisherman_name}
</p>

                          <p className="mt-2 text-slate-400">
                            {
                              violation.description
                            }
                          </p>
                        </div>

                        <span className="rounded-full bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-300">
                          CRITICAL
                        </span>
                      </div>
                    </div>
                  )
                )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
