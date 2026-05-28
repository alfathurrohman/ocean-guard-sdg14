"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Vessel {
  id: number;
  vessel_name: string;
}

interface Location {
  id: number;
  vessel_name: string;
  fisherman_name: string;
  latitude: number;
  longitude: number;
  recorded_at: string;
}

export default function TrackingPage() {
  const router = useRouter();

  const [vessels, setVessels] = useState<Vessel[]>([]);

  const [locations, setLocations] = useState<
    Location[]
  >([]);

  const [formData, setFormData] =
    useState({
      vessel_id: "",
      latitude: "",
      longitude: "",
    });

  const [loadingLocation, setLoadingLocation] =
    useState(false);

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

    fetchLocations();
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

  const fetchLocations = async () => {
    try {
      const token = localStorage.getItem(
        "token"
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vessel-locations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log(
        "LOCATIONS DATA:",
        data
      );

      setLocations(data);
    } catch (error) {
      console.error(error);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {

      alert(
        "Geolocation is not supported by your browser"
      );

      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {

        setFormData({
          ...formData,

          latitude:
            position.coords.latitude.toString(),

          longitude:
            position.coords.longitude.toString(),
        });

        setLoadingLocation(false);
      },

      () => {

        alert(
          "Failed to detect location"
        );

        setLoadingLocation(false);
      }
    );
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/vessel-locations`,
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

            latitude: Number(
              formData.latitude
            ),

            longitude: Number(
              formData.longitude
            ),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        alert(data.error);

        return;
      }

      alert(
        "GPS location submitted successfully"
      );

      setFormData({
        vessel_id: "",
        latitude: "",
        longitude: "",
      });

      fetchLocations();

    } catch (error) {

      console.error(error);

      alert(
        "Failed to submit location"
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
              GPS Vessel Monitoring
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

            <button className="w-full rounded-xl bg-cyan-500/20 px-4 py-3 text-left text-cyan-300">
              GPS Tracking
            </button>

            <button
              onClick={() =>
                router.push("/catch-reports")
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

          {/* HEADER */}
          <div className="mb-8">

            <p className="text-cyan-300">
              Real-Time Marine Surveillance
            </p>

            <h1 className="mt-3 text-5xl font-bold">
              Vessel GPS Tracking
            </h1>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-400">
              Monitor real-time vessel movement
              and marine ecosystem activity
              through intelligent GPS
              surveillance technology.
            </p>
          </div>

          {/* FORM */}
          <div className="mb-8 rounded-3xl border border-cyan-900/20 bg-slate-900/60 p-8">

            <div className="mb-6">

              <h2 className="text-3xl font-bold">
                Submit GPS Coordinates
              </h2>

              <p className="mt-3 text-slate-400">
                Ocean Guard automatically
                records vessel location data
                for marine activity monitoring.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* VESSEL */}
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

                {Array.isArray(vessels) &&
                  vessels.map((vessel) => (
                    <option
                      key={vessel.id}
                      value={vessel.id}
                    >
                      {
                        vessel.vessel_name
                      }
                    </option>
                  ))}
              </select>

              {/* LATITUDE */}
              <input
                type="number"
                step="any"
                placeholder="Latitude"
                value={formData.latitude}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    latitude:
                      e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4"
                required
              />

              {/* LONGITUDE */}
              <input
                type="number"
                step="any"
                placeholder="Longitude"
                value={formData.longitude}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    longitude:
                      e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4"
                required
              />

              {/* AUTO DETECT */}
              <button
                type="button"
                onClick={detectLocation}
                className="w-full rounded-xl bg-cyan-500/20 py-4 font-semibold text-cyan-300"
              >
                {loadingLocation
                  ? "Detecting GPS..."
                  : "Auto Detect GPS"}
              </button>

              {/* SUBMIT */}
              <button className="w-full rounded-xl bg-cyan-500 py-4 font-semibold text-black transition hover:bg-cyan-400">
                Submit GPS Coordinates
              </button>
            </form>
          </div>

          {/* TABLE */}
          <div className="rounded-3xl border border-cyan-900/20 bg-slate-900/60 p-8">

            <div className="mb-6">

              <h2 className="text-3xl font-bold">
                Latest Vessel Coordinates
              </h2>

              <p className="mt-3 text-slate-400">
                Real-time marine vessel
                location monitoring system.
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
                      Latitude
                    </th>

                    <th className="pb-4">
                      Longitude
                    </th>

                    <th className="pb-4">
                      Recorded At
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {Array.isArray(locations) &&
                    locations.map(
                      (location) => (
                        <tr
                          key={location.id}
                          className="border-b border-slate-800"
                        >

                          <td className="py-4">
                            {
                              location.vessel_name
                            }
                          </td>

                          <td className="py-4 text-cyan-300">
                            {
                              location.fisherman_name
                            }
                          </td>

                          <td className="py-4">
                            {
                              location.latitude
                            }
                          </td>

                          <td className="py-4">
                            {
                              location.longitude
                            }
                          </td>

                          <td className="py-4">
                            {new Date(
                              location.recorded_at
                            ).toLocaleString()}
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
