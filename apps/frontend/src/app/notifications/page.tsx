"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationsPage() {

  const router = useRouter();

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

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

    fetchNotifications();

  }, []);

  const fetchNotifications = async () => {

    try {

      const token = localStorage.getItem(
        "token"
      );

      const response = await fetch(
        `/api/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log(
        "NOTIFICATIONS:",
        data
      );

      setNotifications(data);

    } catch (error) {

      console.error(error);
    }
  };

  const deleteNotification = async (
    id: number
  ) => {

    const confirmDelete = confirm(
      "Delete notification?"
    );

    if (!confirmDelete) {

      return;
    }

    try {

      const token = localStorage.getItem(
        "token"
      );

      const response = await fetch(
        `/api/notifications/${id}`,
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

      fetchNotifications();

    } catch (error) {

      console.error(error);
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
              Fisherman Notification Center
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

            <button
              onClick={() =>
                router.push("/catch-reports")
              }
              className="w-full rounded-xl px-4 py-3 text-left text-slate-300 hover:bg-slate-800"
            >
              Catch Reports
            </button>

            <button className="w-full rounded-xl bg-cyan-500/20 px-4 py-3 text-left text-cyan-300">
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
              Official Marine Communication
            </p>

            <h1 className="mt-3 text-5xl font-bold">
              Notifications Center
            </h1>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-400">
              Receive official warnings,
              marine alerts, and sustainability
              notices from Ocean Guard
              officers.
            </p>
          </div>

          {/* NOTIFICATIONS */}
          <div className="space-y-4">

            {notifications.length === 0 ? (

              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-center text-slate-400">

                No notifications available.
              </div>

            ) : (

              notifications.map(
                (notification) => (

                  <div
                    key={notification.id}
                    className="rounded-3xl border border-cyan-900/20 bg-slate-900/60 p-6"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <h2 className="text-2xl font-bold text-cyan-300">
                          {
                            notification.title
                          }
                        </h2>

                        <p className="mt-4 text-lg leading-8 text-slate-300">
                          {
                            notification.message
                          }
                        </p>

                        <p className="mt-4 text-sm text-slate-500">
                          {new Date(
                            notification.created_at
                          ).toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          deleteNotification(
                            notification.id
                          )
                        }
                        className="rounded-xl bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/30"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
