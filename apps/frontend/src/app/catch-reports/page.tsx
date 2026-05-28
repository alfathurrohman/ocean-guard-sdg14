"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Vessel {
  id: number;
  vessel_name: string;
  activity_status: string;
  severity: string;
}

interface CatchReport {
  id: number;
  vessel_name: string;
  fisherman_name: string;
  fish_type: string;
  catch_weight: number;
  fishing_zone: string;
  activity_status: string;
  severity: string;
}

export default function CatchReportsPage() {

  const router = useRouter();

  const [vessels, setVessels] =
    useState<Vessel[]>([]);

  const [reports, setReports] =
    useState<CatchReport[]>([]);

  const [formData, setFormData] =
    useState({
      vessel_id: "",
      fish_type: "",
      catch_weight: "",
      fishing_zone: "",
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

    if (role === "officer") {

      router.push("/officer");

      return;
    }

    fetchVessels();

    fetchReports();

  }, []);

  const fetchVessels = async () => {

    try {

      const token = localStorage.getItem(
        "token"
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vessels`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setVessels(data);

    } catch (error) {

      console.error(error);
    }
  };

  const fetchReports = async () => {

    try {

      const token = localStorage.getItem(
        "token"
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/catch-reports`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setReports(data);

    } catch (error) {

      console.error(error);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem(
        "token"
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/catch-reports`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            vessel_id: Number(
              formData.vessel_id
            ),

            fish_type:
              formData.fish_type,

            catch_weight: Number(
              formData.catch_weight
            ),

            fishing_zone:
              formData.fishing_zone,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        alert(data.error);

        return;
      }

      alert(
        "Catch report submitted successfully."
      );

      setFormData({
        vessel_id: "",
        fish_type: "",
        catch_weight: "",
        fishing_zone: "",
      });

      fetchReports();

    } catch (error) {

      console.error(error);

      alert(
        "Failed to submit catch report"
      );
    }
  };

  const handleLogout = () => {

    const confirmLogout = confirm(
      "Are you sure you want to logout?"
    );

    if (confirmLogout) {

      localStorage.removeItem("token");

      localStorage.removeItem("role");

      router.push("/login");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900 text-white">

      <div className="flex">

        {/* SIDEBAR */}
        <aside className="min-h-screen w-72 border-r border-cyan-900/20 bg-slate-950/70">

          <div className="border-b border-cyan-900/20 p-6">

            <h1 className="text-2xl font-bold text-cyan-300">
              Ocean Guard
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Sustainable Fishing Reports
            </p>
          </div>

          <nav className="space-y-2 p-4">

            <button
              onClick={() =>
                router.push("/dashboard")
              }
              className="w-full rounded-xl px-4 py-3 text-left text-slate-300 hover:bg-slate-800"
            >
              Dashboard
            </button>

            <button
              onClick={() =>
                router.push("/vessels")
              }
              className="w-full rounded-xl px-4 py-3 text-left text-slate-300 hover:bg-slate-800"
            >
              My Vessels
            </button>

            <button
              onClick={() =>
                router.push("/tracking")
              }
              className="w-full rounded-xl px-4 py-3 text-left text-slate-300 hover:bg-slate-800"
            >
              GPS Tracking
            </button>

            <button className="w-full rounded-xl bg-cyan-500/20 px-4 py-3 text-left text-cyan-300">
              Catch Reports
            </button>

            <button
              onClick={() =>
                router.push("/notifications")
              }
              className="w-full rounded-xl px-4 py-3 text-left text-slate-300 hover:bg-slate-800"
            >
              Notifications
            </button>
          </nav>

          <div className="p-4">

            <button
              onClick={handleLogout}
              className="w-full rounded-xl bg-red-500/20 px-4 py-3 text-red-300"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* CONTENT */}
        <section className="flex-1 p-8">

          {/* HEADER */}
          <div className="mb-8">

            <p className="text-cyan-300">
              SDG14 Marine Sustainability
            </p>

            <h1 className="mt-3 text-5xl font-bold">
              Catch Reports Monitoring
            </h1>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-400">
              Submit sustainable fishing
              activity reports and support
              marine ecosystem protection.
            </p>
          </div>

          {/* FORM */}
          <div className="mb-8 rounded-3xl border border-cyan-900/20 bg-slate-900/60 p-8">

            <div className="mb-6">

              <h2 className="text-3xl font-bold">
                Submit Catch Report
              </h2>

              <p className="mt-3 text-slate-400">
                Record fishing activity for
                SDG14 sustainability monitoring.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              <select
                value={formData.vessel_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vessel_id:
                      e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4"
                required
              >
                <option value="">
                  Select Vessel
                </option>

                {vessels.map((vessel) => (
                  <option
                    key={vessel.id}
                    value={vessel.id}
                  >
                    {vessel.vessel_name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Fish Type"
                value={formData.fish_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fish_type:
                      e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4"
                required
              />

              <input
                type="number"
                placeholder="Catch Weight (kg)"
                value={formData.catch_weight}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    catch_weight:
                      e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4"
                required
              />

              <select
                value={formData.fishing_zone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fishing_zone:
                      e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4"
                required
              >
                <option value="">
                  Select Official Marine Zone
                </option>

                <option value="Java Sea">
                  Java Sea (SAFE)
                </option>

                <option value="Sulawesi Sea">
                  Sulawesi Sea (SAFE)
                </option>

                <option value="Natuna Sea">
                  Natuna Sea (MONITORED)
                </option>

                <option value="Coral Conservation Area">
                  Coral Conservation Area
                  (CRITICAL)
                </option>

                <option value="SDG14 Marine Reserve">
                  SDG14 Marine Reserve
                  (CRITICAL)
                </option>
              </select>

              <button className="w-full rounded-xl bg-cyan-500 py-4 font-semibold text-black hover:bg-cyan-400">
                Submit Catch Report
              </button>
            </form>
          </div>

          {/* TABLE */}
          <div className="rounded-3xl border border-cyan-900/20 bg-slate-900/60 p-8">

            <div className="mb-6">

              <h2 className="text-3xl font-bold">
                Marine Activity Reports
              </h2>

              <p className="mt-3 text-slate-400">
                Sustainable fishing activity
                and marine ecosystem monitoring.
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
                      Fish
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
                    reports
                  ) &&
                    reports.map(
                      (report) => (
                        <tr
                          key={report.id}
                          className="border-b border-slate-800"
                        >

                          <td className="py-4">
                            {
                              report.vessel_name
                            }
                          </td>

                          <td className="py-4">
                            {
                              report.fish_type
                            }
                          </td>

                          <td className="py-4">
                            {
                              report.catch_weight
                            }{" "}
                            kg
                          </td>

                          <td className="py-4">
                            {
                              report.fishing_zone
                            }
                          </td>

                          <td className="py-4">

                            <span
                              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                                report.activity_status ===
                                "SAFE"
                                  ? "bg-green-500/20 text-green-300"

                                  : report.activity_status ===
                                      "MONITORED"
                                    ? "bg-yellow-500/20 text-yellow-300"

                                    : "bg-red-500/20 text-red-300"
                              }`}
                            >
                              {
                                report.activity_status
                              }
                            </span>
                          </td>

                          <td className="py-4">

                            <span
                              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                                report.severity ===
                                "LOW"
                                  ? "bg-green-500/20 text-green-300"

                                  : report.severity ===
                                      "MEDIUM"
                                    ? "bg-yellow-500/20 text-yellow-300"

                                    : report.severity ===
                                        "HIGH"
                                      ? "bg-orange-500/20 text-orange-300"

                                      : "bg-red-500/20 text-red-300"
                              }`}
                            >
                              {
                                report.severity
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
        </section>
      </div>
    </main>
  );
}
