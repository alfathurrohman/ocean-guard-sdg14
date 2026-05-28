"use client";

import { usePathname, useRouter } from "next/navigation";

export default function OfficerSidebar() {

  const router = useRouter();

  const pathname = usePathname();

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

  const menuItems = [
    {
      label: "National Monitoring",
      path: "/officer",
    },

    {
      label: "Marine Violations",
      path: "/officer/violations",
    },

    {
      label: "GPS Monitoring",
      path: "/officer/tracking",
    },

   {
  label: "Notifications",
  path: "/officer/notifications",
},
  ];

  return (
    <aside className="min-h-screen w-72 border-r border-red-900/20 bg-slate-950/70">

      {/* HEADER */}
      <div className="border-b border-red-900/20 p-6">

        <h1 className="text-2xl font-bold text-red-300">
          Ocean Guard
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Officer Control Center
        </p>
      </div>

      {/* NAVIGATION */}
      <nav className="space-y-2 p-4">

        {menuItems.map((item) => (

          <button
            key={item.path}
            onClick={() =>
              router.push(item.path)
            }
            className={`w-full rounded-xl px-4 py-3 text-left transition ${
              pathname === item.path

                ? "bg-red-500/20 text-red-300"

                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="p-4">

        <button
          onClick={handleLogout}
          className="w-full rounded-xl bg-red-500/20 px-4 py-3 text-red-300 transition hover:bg-red-500/30"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
