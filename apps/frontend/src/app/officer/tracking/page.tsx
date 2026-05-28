"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OfficerSidebar from "@/components/OfficerSidebar";

interface Location {
  id: number;
  vessel_name: string;
  fisherman_name: string;
  latitude: number;
  longitude: number;
  recorded_at: string;
}

export default function OfficerTrackingPage() {

  const router = useRouter();

  const [locations, setLocations] =
    useState<Location[]>([]);

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

    fetchLocations();

  }, []);

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
        "OFFICER LOCATIONS:",
        data
      );

      setLocations(data);

    } catch (error) {

      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-900 text-white">

      <div className="flex">

        <OfficerSidebar />

        <section className="flex-1 p-8">

          <div className="mb-8">

            <p className="text-red-300">
              National Marine Surveillance
            </p>

            <h1 className="mt-3 text-5xl font-bold">
              Officer GPS Monitoring
            </h1>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-400">
              Monitor all vessel movements and
              fisherman activity across
              national waters in real-time.
            </p>
          </div>

          <div className="rounded-3xl border border-red-900/20 bg-slate-900/60 p-8">

            <div className="mb-6">

              <h2 className="text-3xl font-bold">
                Latest Vessel Coordinates
              </h2>

              <p className="mt-3 text-slate-400">
                National marine GPS monitoring
                and fisherman tracking system.
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

                  {locations.map(
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
