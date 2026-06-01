"use client";

import { useEffect, useState } from "react";

interface Report {
  id: string;
  title: string;
  location: string;

  supportCount: number;

  feedback?: string;

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

  isDeleted?: boolean;

  isDiscarded?: boolean;
}

interface Category {
  id: string;
  name: string;
}

export default function AdminPage() {
  const [reports, setReports] = useState<Report[]>([]);

  const [selectedCategory, setSelectedCategory] =
    useState("Todas");

  const [categories, setCategories] = useState<Category[]>([]);

  const [feedbacks, setFeedbacks] = useState<
    Record<string, string>
  >({});

  async function loadReports() {
    const response = await fetch("/api/reports");
    const data = await response.json();

    setReports(data);

    const loadedFeedbacks: Record<string, string> = {};

    data.forEach((report: any) => {
      loadedFeedbacks[report.id] =
        report.feedback || "";
    });

    setFeedbacks(loadedFeedbacks);
  }

  async function loadCategories() {
    const response = await fetch("/api/categories");

    const data = await response.json();

    setCategories(data);
  }

  useEffect(() => {
    loadReports();
    loadCategories();
  }, []);

  const filteredReports =
    selectedCategory === "Todas"
      ? reports
      : reports.filter(
        (report) =>
          report.category?.name === selectedCategory
      ).filter(
        (report) =>
          !report.isDeleted
      );

  const orderedReports =
    [...filteredReports].sort((a, b) => {

      if (
        a.status?.name === "Resuelto" &&
        b.status?.name !== "Resuelto"
      )
        return 1;

      if (
        a.status?.name !== "Resuelto" &&
        b.status?.name === "Resuelto"
      )
        return -1;

      return 0;
    });

  const [showFeedbackWarning, setShowFeedbackWarning] =
    useState(false);

  async function updateStatus(
    reportId: string,
    statusName: string,
    isDiscarded = false,
    isDeleted = false
  ) {
    if (
      statusName === "Resuelto" &&
      !isDiscarded &&
      !isDeleted &&
      !feedbacks[reportId]?.trim()
    ) {
      setShowFeedbackWarning(true);

      return;
    }

    await fetch("/api/admin/report-status", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reportId,
        statusName,
        feedback: feedbacks[reportId] || "",
        isDiscarded,
        isDeleted,
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

        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value)
          }
          className="rounded-xl border p-3"
        >
          <option value="Todas">
            Todas
          </option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.name}
            >
              {category.name}
            </option>
          ))}
        </select>

        {showFeedbackWarning && (
          <div className="fixed right-6 top-6 z-50 rounded-xl bg-red-600 px-6 py-4 text-white shadow-lg">
            Debes escribir cómo se solucionó el problema.

            <button
              onClick={() =>
                setShowFeedbackWarning(false)
              }
              className="ml-4 font-bold"
            >
              ✕
            </button>
          </div>
        )}

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
                  <th className="px-6 py-4 text-left">Apoyos</th>
                  <th className="px-6 py-4 text-left">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {orderedReports.map((report) => (
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

                      {report.isDeleted ? (

                        <span className="rounded-full bg-red-100 px-4 py-2 text-red-700">
                          Eliminado
                        </span>

                      ) : report.isDiscarded ? (

                        <span className="rounded-full bg-orange-100 px-4 py-2 text-orange-700">
                          Descartado
                        </span>

                      ) : (

                        <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                          {report.status?.name}
                        </span>

                      )}

                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                        {report.supportCount}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2">
                        <textarea
                          value={feedbacks[report.id] || ""}
                          onChange={(e) =>
                            setFeedbacks({
                              ...feedbacks,
                              [report.id]: e.target.value,
                            })
                          }
                          placeholder="¿Cómo se solucionó este problema?"
                          className="w-full rounded-xl border p-2 text-sm"
                        />
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

                        <button
                          onClick={() =>
                            updateStatus(
                              report.id,
                              report.status?.name || "Pendiente",
                              true,
                              false
                            )
                          }
                          className="rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                        >
                          Descartar
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(
                              report.id,
                              report.status?.name || "Pendiente",
                              false,
                              true
                            )
                          }
                          className="rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                        >
                          Eliminar
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