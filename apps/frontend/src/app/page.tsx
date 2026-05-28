"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* NAVBAR */}
      <header className="fixed top-0 z-50 w-full border-b border-cyan-900/20 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
          <div>
            <h1 className="text-2xl font-bold text-cyan-300">
              Ocean Guard
            </h1>

            <p className="text-xs text-slate-400">
              SDG 14 Marine Monitoring System
            </p>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-slate-300 transition hover:text-cyan-300"
            >
              Features
            </a>

            <a
              href="#sdg14"
              className="text-slate-300 transition hover:text-cyan-300"
            >
              SDG 14
            </a>

            <a
              href="#monitoring"
              className="text-slate-300 transition hover:text-cyan-300"
            >
              Monitoring
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/login")}
              className="rounded-xl border border-cyan-500/30 px-5 py-2 text-cyan-300 transition hover:bg-cyan-500/10"
            >
              Login
            </button>

            <button
              onClick={() => router.push("/register")}
              className="rounded-xl bg-cyan-500 px-5 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.15),transparent_40%)]"></div>

        <div className="mx-auto grid max-w-7xl items-center gap-16 px-8 py-20 md:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-5 py-2 text-sm text-cyan-300">
              Sustainable Development Goal 14
            </div>

            <h1 className="text-6xl font-black leading-tight">
              Smart Marine
              <span className="block text-cyan-300">
                Ecosystem Monitoring
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-xl leading-9 text-slate-400">
              Government-grade fisheries monitoring platform
              for sustainable ocean ecosystem protection,
              vessel tracking, catch reporting, and illegal
              fishing detection.
            </p>

            <div className="mt-10 flex flex-wrap gap-5">
              <button
                onClick={() => router.push("/register")}
                className="rounded-2xl bg-cyan-500 px-8 py-4 text-lg font-bold text-slate-950 transition hover:bg-cyan-400"
              >
                Get Started
              </button>

              <button
                onClick={() => router.push("/login")}
                className="rounded-2xl border border-cyan-500/30 px-8 py-4 text-lg text-cyan-300 transition hover:bg-cyan-500/10"
              >
                Sign In
              </button>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="relative">
            <div className="rounded-[32px] border border-cyan-900/20 bg-slate-900/60 p-8 backdrop-blur">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    Active Marine Monitoring
                  </p>

                  <h3 className="mt-2 text-4xl font-bold text-cyan-300">
                    24/7
                  </h3>
                </div>

                <div className="h-4 w-4 animate-pulse rounded-full bg-emerald-400"></div>
              </div>

              <div className="space-y-5">
                <div className="rounded-2xl bg-slate-950/60 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">
                        Registered Vessels
                      </p>

                      <h4 className="mt-2 text-3xl font-bold">
                        1,284
                      </h4>
                    </div>

                    <div className="rounded-xl bg-cyan-500/20 px-4 py-2 text-cyan-300">
                      +12%
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-950/60 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">
                        GPS Tracking Active
                      </p>

                      <h4 className="mt-2 text-3xl font-bold">
                        97%
                      </h4>
                    </div>

                    <div className="rounded-xl bg-emerald-500/20 px-4 py-2 text-emerald-300">
                      Stable
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-950/60 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">
                        Illegal Fishing Alerts
                      </p>

                      <h4 className="mt-2 text-3xl font-bold">
                        14
                      </h4>
                    </div>

                    <div className="rounded-xl bg-red-500/20 px-4 py-2 text-red-300">
                      Critical
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GLOW */}
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-8 py-28"
      >
        <div className="mb-16 text-center">
          <p className="text-cyan-300">
            Integrated Maritime Features
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            Government-Grade Monitoring Platform
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-3xl border border-cyan-900/20 bg-slate-900/60 p-8 backdrop-blur">
            <div className="mb-6 text-5xl">🌊</div>

            <h3 className="text-2xl font-bold">
              Real-time GPS Tracking
            </h3>

            <p className="mt-4 leading-8 text-slate-400">
              Monitor vessel movement and marine activity
              through integrated GPS location tracking.
            </p>
          </div>

          <div className="rounded-3xl border border-cyan-900/20 bg-slate-900/60 p-8 backdrop-blur">
            <div className="mb-6 text-5xl">🚨</div>

            <h3 className="text-2xl font-bold">
              Automatic Violation Detection
            </h3>

            <p className="mt-4 leading-8 text-slate-400">
              Detect restricted zone intrusion and illegal
              fishing activity automatically using smart
              monitoring logic.
            </p>
          </div>

          <div className="rounded-3xl border border-cyan-900/20 bg-slate-900/60 p-8 backdrop-blur">
            <div className="mb-6 text-5xl">🐟</div>

            <h3 className="text-2xl font-bold">
              Sustainable Catch Reporting
            </h3>

            <p className="mt-4 leading-8 text-slate-400">
              Digital fisheries reporting system for quota
              management and ecosystem sustainability.
            </p>
          </div>
        </div>
      </section>

      {/* SDG SECTION */}
      <section
        id="sdg14"
        className="border-y border-cyan-900/20 bg-slate-900/40"
      >
        <div className="mx-auto grid max-w-7xl gap-16 px-8 py-28 md:grid-cols-2">
          <div>
            <p className="text-cyan-300">
              Sustainable Development Goal 14
            </p>

            <h2 className="mt-4 text-5xl font-bold">
              Life Below Water
            </h2>

            <p className="mt-8 text-lg leading-9 text-slate-400">
              Ocean Guard supports sustainable marine
              ecosystem protection through digital fisheries
              monitoring, illegal fishing prevention,
              and responsible marine resource management.
            </p>
          </div>

          <div className="rounded-3xl border border-cyan-900/20 bg-slate-950/60 p-10">
            <div className="space-y-8">
              <div>
                <p className="text-sm text-slate-400">
                  Marine Ecosystem Protection
                </p>

                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-[92%] rounded-full bg-cyan-400"></div>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-400">
                  Illegal Fishing Prevention
                </p>

                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-[84%] rounded-full bg-cyan-400"></div>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-400">
                  Sustainable Fisheries Monitoring
                </p>

                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-[96%] rounded-full bg-cyan-400"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

{/* MONITORING SECTION */}
<section
  id="monitoring"
  className="mx-auto max-w-7xl px-8 py-28"
>
  <div className="mb-16 text-center">
    <p className="text-cyan-300">
      Integrated Marine Surveillance
    </p>

    <h2 className="mt-4 text-5xl font-bold">
      Real-Time Ocean Monitoring
    </h2>

    <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-slate-400">
      Ocean Guard continuously monitors vessel
      movement, fishing activity, marine ecosystem
      protection zones, and fisheries sustainability
      through intelligent maritime technology.
    </p>
  </div>

  <div className="grid gap-8 md:grid-cols-3">
    {/* CARD 1 */}
    <div className="rounded-3xl border border-cyan-900/20 bg-slate-900/60 p-8 backdrop-blur">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-bold">
          Vessel Tracking
        </h3>

        <div className="h-3 w-3 animate-pulse rounded-full bg-emerald-400"></div>
      </div>

      <p className="leading-8 text-slate-400">
        GPS-enabled vessel monitoring provides
        real-time location tracking for registered
        fishing vessels across marine zones.
      </p>

      <div className="mt-8 rounded-2xl bg-slate-950/60 p-5">
        <p className="text-sm text-slate-400">
          Active Tracking Coverage
        </p>

        <h4 className="mt-3 text-4xl font-bold text-cyan-300">
          97%
        </h4>
      </div>
    </div>

    {/* CARD 2 */}
    <div className="rounded-3xl border border-cyan-900/20 bg-slate-900/60 p-8 backdrop-blur">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-bold">
          Illegal Fishing Alerts
        </h3>

        <div className="h-3 w-3 animate-pulse rounded-full bg-red-400"></div>
      </div>

      <p className="leading-8 text-slate-400">
        Automatic violation detection identifies
        vessels entering restricted marine ecosystem
        protection zones.
      </p>

      <div className="mt-8 rounded-2xl bg-slate-950/60 p-5">
        <p className="text-sm text-slate-400">
          Active Violation Alerts
        </p>

        <h4 className="mt-3 text-4xl font-bold text-red-300">
          14
        </h4>
      </div>
    </div>

    {/* CARD 3 */}
    <div className="rounded-3xl border border-cyan-900/20 bg-slate-900/60 p-8 backdrop-blur">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-bold">
          Sustainable Fisheries
        </h3>

        <div className="h-3 w-3 animate-pulse rounded-full bg-cyan-400"></div>
      </div>

      <p className="leading-8 text-slate-400">
        Digital catch reporting and quota monitoring
        help maintain sustainable fisheries and marine
        biodiversity.
      </p>

      <div className="mt-8 rounded-2xl bg-slate-950/60 p-5">
        <p className="text-sm text-slate-400">
          Quota Compliance
        </p>

        <h4 className="mt-3 text-4xl font-bold text-cyan-300">
          92%
        </h4>
      </div>
    </div>
  </div>
</section>

      {/* FOOTER */}
      <footer className="border-t border-cyan-900/20 py-10 text-center text-slate-500">
        <p>
          Ocean Guard — Smart Marine Ecosystem Monitoring
          Platform
        </p>

        <p className="mt-2 text-sm">
          Built for Sustainable Development Goal 14
        </p>
      </footer>
    </main>
  );
}
