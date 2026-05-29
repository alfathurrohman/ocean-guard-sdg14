"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Vessel {
  id: number;
  vessel_name: string;
  registration_number: string;
  status: string;
}

export default function VesselsPage() {
  const router = useRouter();

  const [vessels, setVessels] = useState<Vessel[]>([]);

  const [vesselName, setVesselName] =
    useState("");

  const [
    registrationNumber,
    setRegistrationNumber,
  ] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetchVessels();
  }, []);

  const fetchVessels = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `/api/vessels`,
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

  const handleCreateVessel = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `/api/vessels`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            vessel_name: vesselName,
            registration_number:
              registrationNumber,
          }),
        }
      );

      if (!response.ok) {
        const errorData =
          await response.text();

        alert(errorData);

        return;
      }

      setVesselName("");

      setRegistrationNumber("");

      fetchVessels();
    } catch (error) {
      console.error(error);

      alert("Failed to create vessel");
    }
  };

  const handleLogout = () => {
    const confirmLogout = confirm(
      "Are you sure you want to logout?"
    );

    if (confirmLogout) {
      localStorage.removeItem("token");

      router.push("/login");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      <div className="flex">
        {/* SIDEBAR */}
        <aside className="min-h-screen w-72 border-r border-cyan-900/20 bg-slate-950/70">
          <div className="border-b border-cyan-900/20 p-6">
            <h1 className="text-2xl font-bold text-cyan-300">
              Ocean Guard
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Fisherman Dashboard
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

            <button className="w-full rounded-xl bg-cyan-500/20 px-4 py-3 text-left text-cyan-300">
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

            <button
              onClick={() =>
                router.push(
                  "/catch-reports"
                )
              }
              className="w-full rounded-xl px-4 py-3 text-left text-slate-300 hover:bg-slate-800"
            >
              Catch Reports
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
          <div className="mb-8">
            <h1 className="text-5xl font-bold">
              Vessel Management
            </h1>

            <p className="mt-3 text-lg text-slate-400">
              Register and manage fishing
              vessels.
            </p>
          </div>

          {/* FORM */}
          <div className="mb-8 rounded-3xl bg-slate-900/60 p-8">
            <h2 className="mb-6 text-3xl font-bold">
              Register New Vessel
            </h2>

            <form
              onSubmit={handleCreateVessel}
              className="space-y-4"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Vessel Name"
                  value={vesselName}
                  onChange={(e) =>
                    setVesselName(
                      e.target.value
                    )
                  }
                  className="rounded-xl border border-slate-700 bg-slate-950 p-4"
                  required
                />

                <input
                  type="text"
                  placeholder="Registration Number"
                  value={
                    registrationNumber
                  }
                  onChange={(e) =>
                    setRegistrationNumber(
                      e.target.value
                    )
                  }
                  className="rounded-xl border border-slate-700 bg-slate-950 p-4"
                  required
                />
              </div>

              <button className="w-full rounded-xl bg-cyan-500 py-4 font-semibold text-black">
                Register Vessel
              </button>
            </form>
          </div>

          {/* TABLE */}
          <div className="rounded-3xl bg-slate-900/60 p-8">
            <h2 className="mb-6 text-3xl font-bold">
              Your Registered Vessels
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-left text-slate-400">
                    <th className="pb-4">
                      Vessel Name
                    </th>

                    <th className="pb-4">
                      Registration Number
                    </th>

                    <th className="pb-4">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {Array.isArray(vessels) &&
                    vessels.map(
                      (vessel) => (
                        <tr
                          key={vessel.id}
                          className="border-b border-slate-800"
                        >
                          <td className="py-4">
                            {
                              vessel.vessel_name
                            }
                          </td>

                          <td className="py-4">
                            {
                              vessel.registration_number
                            }
                          </td>

                          <td className="py-4 text-cyan-300">
                            {
                              vessel.status
                            }
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
