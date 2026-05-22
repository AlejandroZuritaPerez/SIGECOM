"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [reports, setReports] = useState<any[]>([]);
  const totalReports = reports.length;

  const pendingReports = reports.filter(
    (report) => report.status.name === "Pendiente"
  ).length;

  const processReports = reports.filter(
    (report) => report.status.name === "En Proceso"
  ).length;

  const resolvedReports = reports.filter(
    (report) => report.status.name === "Resuelto"
  ).length;

  useEffect(() => {

    async function fetchReports() {

      try {

        const response = await fetch("/api/my-reports");

        const data = await response.json();

        setReports(data);

      } catch (error) {

        console.error(error);

      }
    }

    fetchReports();

  }, []);

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 flex-col bg-emerald-950 text-white lg:flex">
          <div className="border-b border-white/10 px-6 py-5">
            <h1 className="text-2xl font-bold tracking-wide">SIGECOM</h1>
            <p className="mt-1 text-sm text-emerald-100/80">
              Sistema de Gestión Comunitaria
            </p>
          </div>

          <nav className="flex flex-1 flex-col gap-2 px-4 py-6 text-sm">
            <Link
              href="/dashboard"
              className="rounded-2xl bg-white/10 px-4 py-3 font-medium transition hover:bg-white/15"
            >
              Panel de Control
            </Link>
            <Link
              href="/report"
              className="rounded-2xl px-4 py-3 text-emerald-100/90 transition hover:bg-white/10"
            >
              Nuevo Reporte
            </Link>
            <Link
              href="/reports"
              className="rounded-2xl px-4 py-3 text-emerald-100/90 transition hover:bg-white/10"
            >
              Mis Reportes
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="mt-auto rounded-2xl px-4 py-3 text-left text-emerald-100/90 transition hover:bg-white/10"
            >
              Cerrar Sesión
            </button>
          </nav>

          <div className="border-t border-white/10 px-6 py-5">
            <div className="rounded-3xl bg-white/10 p-4">
              <p className="text-sm font-semibold"> {session?.user?.name} </p>
              <p className="text-xs text-emerald-100/80"> {session?.user?.role} </p>
            </div>
          </div>
        </aside>

        <section className="flex-1">
          <header className="flex items-center justify-between border-b bg-white px-4 py-4 shadow-sm sm:px-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Panel de Control
              </h2>
              <p className="text-sm text-gray-500">
                Vista general del ciudadano
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-gray-900"> {session?.user?.name} </p>
                <p className="text-xs text-gray-500"> {session?.user?.email} </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 font-bold text-gray-700">
                C-A
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Mis Reportes</p>
                <p className="mt-3 text-4xl font-bold text-gray-900"> {totalReports} </p>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Pendientes</p>
                <p className="mt-3 text-4xl font-bold text-gray-900"> {pendingReports} </p>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">En Proceso</p>
                <p className="mt-3 text-4xl font-bold text-gray-900"> {processReports} </p>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Resueltos</p>
                <p className="mt-3 text-4xl font-bold text-gray-900"> {resolvedReports} </p>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              <div className="rounded-3xl bg-white p-5 shadow-sm xl:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Mapa / Ubicaciones
                    </h3>
                    <p className="text-sm text-gray-500">
                      Aquí irá la vista visual de los reportes
                    </p>
                  </div>
                  <Link
                    href="/report"
                    className="rounded-2xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                  >
                    + Nuevo reporte
                  </Link>
                </div>

                <div className="flex min-h-[420px] items-center justify-center rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                  <div>
                    <p className="text-lg font-semibold text-gray-700">
                      Espacio para mapa
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      Después aquí conectamos Google Maps, Leaflet o la opción
                      que decidan usar.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">

                {reports.length === 0 ? (

                  <div className="rounded-2xl bg-gray-100 p-4 text-sm text-gray-500">

                    No tienes reportes todavía.

                  </div>

                ) : (

                  reports.map((report) => (

                    <div
                      key={report.id}
                      className="rounded-2xl bg-gray-100 p-4"
                    >

                      <h3 className="font-semibold text-gray-900">

                        {report.title}

                      </h3>

                      <p className="mt-1 text-sm text-gray-600">

                        {report.location}

                      </p>

                      <div className="mt-2 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">

                        {report.status.name}

                      </div>

                    </div>
                  ))
                )}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900">
                    Estado de mis reportes
                  </h3>
                  <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-500">
                    Aquí irá una gráfica o barra de estado.
                  </div>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900">
                    Acciones rápidas
                  </h3>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <Link
                      href="/report"
                      className="rounded-2xl bg-green-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-green-700"
                    >
                      Nuevo reporte
                    </Link>
                    <button>
                      <a
                        href="/reports"
                        className="flex items-center justify-center rounded-2xl border border-gray-300 px-6 py-4 text-xl font-medium text-gray-800 transition hover:bg-gray-100"
                      >

                        Ver historial

                      </a>
                    </button>
                  </div>

                  <div className="mt-4 rounded-2xl bg-gray-50 p-4 text-sm text-gray-500">
                    Más adelante aquí podemos poner botones para consultar estado,
                    editar perfil y más.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}