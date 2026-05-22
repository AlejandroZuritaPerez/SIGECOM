"use client";

import { useEffect, useState } from "react";

interface Report {
  id: string;
  title: string;
  location: string;

  user?: {
    name: string;
  };

  category?: {
    name: string;
  };

  status?: {
    id: string;
    name: string;
  };
}

export default function AdminPage() {
  const [reports, setReports] = useState<Report[]>([]);

  async function loadReports() {
    const response = await fetch("/api/reports");
    const data = await response.json();

    setReports(data);
  }

  useEffect(() => {
    loadReports();
  }, []);

  async function updateStatus(reportId: string, statusName: string) {
    await fetch("/api/admin/report-status", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reportId,
        statusName,
      }),
    });

    loadReports();
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900">
            Panel Administrativo
          </h1>

          <p className="mt-3 text-lg text-gray-500">
            Gestión general de reportes comunitarios.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-emerald-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Título</th>
                  <th className="px-6 py-4 text-left">Ciudadano</th>
                  <th className="px-6 py-4 text-left">Categoría</th>
                  <th className="px-6 py-4 text-left">Ubicación</th>
                  <th className="px-6 py-4 text-left">Estado</th>
                  <th className="px-6 py-4 text-left">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {reports.map((report) => (
                  <tr
                    key={report.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-5 font-semibold text-gray-900">
                      {report.title}
                    </td>

                    <td className="px-6 py-5 text-gray-700">
                      {report.user?.name}
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                        {report.category?.name}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-gray-600">
                      {report.location}
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                        {report.status?.name}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            updateStatus(report.id, "Pendiente")
                          }
                          className="rounded-xl bg-yellow-500 px-3 py-2 text-sm font-semibold text-white"
                        >
                          Pendiente
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(report.id, "En Proceso")
                          }
                          className="rounded-xl bg-blue-500 px-3 py-2 text-sm font-semibold text-white"
                        >
                          En Proceso
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(report.id, "Resuelto")
                          }
                          className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
                        >
                          Resuelto
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}