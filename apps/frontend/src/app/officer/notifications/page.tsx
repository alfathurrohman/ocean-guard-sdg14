"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OfficerSidebar from "@/components/OfficerSidebar";

interface Fisherman {
  id: number;
  name: string;
}

export default function OfficerNotificationsPage() {

  const router = useRouter();

  const [fishermen, setFishermen] =
    useState<Fisherman[]>([]);

  const [formData, setFormData] =
    useState({
      user_id: "",
      title: "",
      message: "",
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

    if (role !== "officer") {

      router.push("/dashboard");

      return;
    }

    fetchFishermen();

  }, []);

  const fetchFishermen = async () => {

    try {

      const token = localStorage.getItem(
        "token"
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/fishermen`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setFishermen(data);

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
        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            user_id: Number(
              formData.user_id
            ),

            title: formData.title,

            message:
              formData.message,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        alert(data.error);

        return;
      }

      alert(
        "Notification sent successfully"
      );

      setFormData({
        user_id: "",
        title: "",
        message: "",
      });

    } catch (error) {

      console.error(error);

      alert(
        "Failed to send notification"
      );
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-900 text-white">

      <div className="flex">

        <OfficerSidebar />

        <section className="flex-1 p-8">

          {/* HEADER */}
          <div className="mb-8">

            <p className="text-red-300">
              Official Marine Communication
            </p>

            <h1 className="mt-3 text-5xl font-bold">
              Send Notifications
            </h1>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-400">
              Send official marine warnings,
              sustainability alerts, and
              investigation notices to
              fishermen.
            </p>
          </div>

          {/* FORM */}
          <div className="rounded-3xl border border-red-900/20 bg-slate-900/60 p-8">

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* FISHERMAN */}
              <select
                value={formData.user_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    user_id:
                      e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4"
                required
              >
                <option value="">
                  Select Fisherman
                </option>

                {fishermen.map(
                  (fisherman) => (
                    <option
                      key={fisherman.id}
                      value={fisherman.id}
                    >
                      {
                        fisherman.name
                      }
                    </option>
                  )
                )}
              </select>

              {/* TITLE */}
              <input
                type="text"
                placeholder="Notification Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title:
                      e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4"
                required
              />

              {/* MESSAGE */}
              <textarea
                placeholder="Official warning or marine notice..."
                value={formData.message}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    message:
                      e.target.value,
                  })
                }
                className="min-h-[200px] w-full rounded-xl border border-slate-700 bg-slate-950 p-4"
                required
              />

              <button className="w-full rounded-xl bg-red-500 py-4 font-semibold text-black hover:bg-red-400">
                Send Official Notification
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
