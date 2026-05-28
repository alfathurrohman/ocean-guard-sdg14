"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OfficerSidebar from "@/components/OfficerSidebar";

interface Violation {
  id: number;
  vessel_name: string;
  fisherman_name: string;
  violation_type: string;
  description: string;
  severity: string;
  status: string;
}

export default function ViolationsPage() {

  const router = useRouter();

  const [violations, setViolations] =
    useState<Violation[]>([]);

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

    fetchViolations();

  }, []);

  // =========================
  // FETCH VIOLATIONS
  // =========================

  const fetchViolations = async () => {

    try {

      const token = localStorage.getItem(
        "token"
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/violations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log(
        "VIOLATIONS:",
        data
      );

      setViolations(data);

    } catch (error) {

      console.error(error);
    }
  };

  // =========================
  // UPDATE STATUS
  // =========================

  const updateStatus = async (
    id: number,
    status: string
  ) => {

    try {

      const token = localStorage.getItem(
        "token"
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/violations/${id}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        alert(data.error);

        return;
      }

      fetchViolations();

    } catch (error) {

      console.error(error);
    }
  };

  // =========================
  // DELETE VIOLATION
  // =========================

  const deleteViolation = async (
    id: number
  ) => {

    const confirmDelete = confirm(
      "Delete this resolved violation?"
    );

    if (!confirmDelete) {

      return;
    }

    try {

      const token = localStorage.getItem(
        "token"
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/violations/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {

        alert(data.error);

        return;
      }

      alert(
        "Violation deleted successfully"
      );

      fetchViolations();

    } catch (error) {

      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-900 text-white">

      <div className="flex">

        {/* SIDEBAR */}
        <OfficerSidebar />

        {/* CONTENT */}
        <section className="flex-1 p-8">

          {/* HEADER */}
          <div className="mb-8">

            <p className="text-red-300">
              National Marine Enforcement
            </p>

            <h1 className="mt-3 text-5xl font-bold">
              Officer Violations Center
            </h1>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-400">
              Monitor, investigate, resolve,
              and manage marine sustainability
              violations across national
              waters.
            </p>
          </div>

          {/* TABLE */}
          <div className="rounded-3xl border border-red-900/20 bg-slate-900/60 p-8">

            <div className="mb-6">

              <h2 className="text-3xl font-bold">
                Marine Violations
              </h2>

              <p className="mt-3 text-slate-400">
                SDG14 marine enforcement and
                sustainability monitoring
                system.
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
                      Violation
                    </th>

                    <th className="pb-4">
                      Description
                    </th>

                    <th className="pb-4">
                      Severity
                    </th>

                    <th className="pb-4">
                      Status
                    </th>

                    <th className="pb-4">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {Array.isArray(
                    violations
                  ) &&
                    violations.map(
                      (violation) => (
                        <tr
                          key={violation.id}
                          className="border-b border-slate-800"
                        >

                          {/* VESSEL */}
                          <td className="py-4">
                            {
                              violation.vessel_name
                            }
                          </td>

                          {/* FISHERMAN */}
                          <td className="py-4 text-cyan-300">
                            {
                              violation.fisherman_name
                            }
                          </td>

                          {/* VIOLATION TYPE */}
                          <td className="py-4">

                            <span className="rounded-full bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-300">
                              {
                                violation.violation_type
                              }
                            </span>
                          </td>

                          {/* DESCRIPTION */}
                          <td className="py-4 text-slate-300">
                            {
                              violation.description
                            }
                          </td>

                          {/* SEVERITY */}
                          <td className="py-4">

                            <span
                              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                                violation.severity ===
                                "LOW"
                                  ? "bg-green-500/20 text-green-300"

                                  : violation.severity ===
                                      "MEDIUM"
                                    ? "bg-yellow-500/20 text-yellow-300"

                                    : violation.severity ===
                                        "HIGH"
                                      ? "bg-orange-500/20 text-orange-300"

                                      : "bg-red-500/20 text-red-300"
                              }`}
                            >
                              {
                                violation.severity
                              }
                            </span>
                          </td>

                          {/* STATUS */}
                          <td className="py-4">

                            <select
                              value={
                                violation.status
                              }
                              onChange={(e) =>
                                updateStatus(
                                  violation.id,
                                  e.target.value
                                )
                              }
                              className={`rounded-full border-none px-4 py-2 text-sm font-semibold outline-none ${
                                violation.status ===
                                "OPEN"
                                  ? "bg-red-500/20 text-red-300"

                                  : violation.status ===
                                      "INVESTIGATING"
                                    ? "bg-yellow-500/20 text-yellow-300"

                                    : "bg-green-500/20 text-green-300"
                              }`}
                            >
                              <option value="OPEN">
                                OPEN
                              </option>

                              <option value="INVESTIGATING">
                                INVESTIGATING
                              </option>

                              <option value="RESOLVED">
                                RESOLVED
                              </option>
                            </select>
                          </td>

                          {/* ACTION */}
                          <td className="py-4">

                            {violation.status ===
                            "RESOLVED" ? (

                              <button
                                onClick={() =>
                                  deleteViolation(
                                    violation.id
                                  )
                                }
                                className="rounded-xl bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/30"
                              >
                                Delete
                              </button>

                            ) : (

                              <span className="text-slate-500">
                                —
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
