"use client";

import { usePathname, useRouter } from "next/navigation";

export default function FishermanSidebar() {
  const router = useRouter();

  const pathname = usePathname();

  const handleLogout = () => {
    const confirmLogout = confirm(
      "Are you sure you want to logout?"
    );

    if (confirmLogout) {
      localStorage.removeItem("token");

      router.push("/login");
    }
  };

  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      label: "My Vessels",
      path: "/vessels",
    },
    {
      label: "GPS Tracking",
      path: "/tracking",
    },
    {
      label: "Catch Reports",
      path: "/catch-reports",
    },
  ];

  return (
    <aside className="min-h-screen w-72 border-r border-cyan-900/20 bg-slate-950/70 backdrop-blur">
      {/* LOGO */}
      <div className="border-b border-cyan-900/20 p-6">
        <h1 className="text-2xl font-bold text-cyan-300">
          Ocean Guard
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Fisherman Dashboard
        </p>
      </div>

      {/* MENU */}
      <nav className="space-y-2 p-4">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`w-full rounded-xl px-4 py-3 text-left transition ${
              pathname === item.path
                ? "bg-cyan-500/20 text-cyan-300"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* LOGOUT */}
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
