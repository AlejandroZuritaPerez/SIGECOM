"use client";

import { useEffect, useState } from "react";

type Report = {
  id: string;
  title: string;
  description: string;
  location: string;

  user: {
    id: string;
    name: string;
    email: string;
  };

  supports: {
    userId: string;
  }[];

  category: {
    name: string;
  };

  status: {
    name: string;
  };

  feedback?: string;
  isDeleted?: boolean;
  isDiscarded?: boolean;

  createdAt: string;
};

export default function ReportsPage() {

  const [reports, setReports] = useState<Report[]>([]);
  const [currentUserId, setCurrentUserId] =
    useState("");
  const [currentEmail, setCurrentEmail] =
    useState("");
  const [editingReport, setEditingReport] =
    useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [reportToDelete, setReportToDelete] =
    useState<string | null>(null);

  const [editTitle, setEditTitle] =
    useState("");

  const [editDescription, setEditDescription] =
    useState("");

  const [editLocation, setEditLocation] =
    useState("");

  function deleteReport(id: string) {

    setReportToDelete(id);

    setShowDeleteModal(true);

  }

  async function confirmDelete() {

    if (!reportToDelete) return;

    try {

      const response = await fetch(
        `/api/reports/${reportToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {

        return;

      }

      setReports((prevReports) =>
        prevReports.filter(
          (report) =>
            report.id !== reportToDelete
        )
      );

      setShowDeleteModal(false);

      setReportToDelete(null);

    } catch (error) {

      console.error(error);

    }

  }

  async function saveReport(id: string) {

    try {

      const response = await fetch(
        `/api/reports/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            title: editTitle,
            description: editDescription,
            location: editLocation,
          }),
        }
      );

      if (!response.ok) {

        alert(
          "No se pudo actualizar"
        );

        return;
      }

      window.location.reload();

    } catch (error) {

      console.error(error);

    }
  }

  const myReports = reports.filter(
    (report) =>
      report.user.email === currentEmail
  );

  const supportedReports = reports.filter(
    (report) =>
      report.user.email !== currentEmail
  );

  useEffect(() => {

    async function fetchReports() {

      try {

        const sessionResponse =
          await fetch("/api/auth/session");

        const session =
          await sessionResponse.json();

        setCurrentEmail(session.user.email);

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

    <main className="min-h-screen bg-gray-100 p-8">

      <div className="mx-auto max-w-5xl">

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-gray-900">

            Historial de Reportes

          </h1>

          <p className="mt-2 text-gray-600">

            Aquí puedes visualizar todos tus reportes realizados.

          </p>

        </div>

        <div className="space-y-6">

          {myReports.length === 0 &&
            supportedReports.length === 0 ? (

            <div className="rounded-3xl bg-white p-10 shadow-sm">

              <p className="text-gray-500">

                Aún no tienes reportes registrados.

              </p>

            </div>

          ) : (
            <>
              {showDeleteModal && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

                  <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">

                    <h2 className="text-2xl font-bold text-gray-900">
                      Eliminar reporte
                    </h2>

                    <p className="mt-3 text-gray-600">
                      Esta acción eliminará
                      permanentemente el reporte.
                    </p>

                    <div className="mt-6 flex justify-end gap-3">

                      <button
                        onClick={() => {
                          setShowDeleteModal(false);
                          setReportToDelete(null);
                        }}
                        className="rounded-xl bg-gray-200 px-4 py-2"
                      >
                        Cancelar
                      </button>

                      <button
                        onClick={confirmDelete}
                        className="rounded-xl bg-red-600 px-4 py-2 text-white"
                      >
                        Eliminar
                      </button>

                    </div>

                  </div>

                </div>

              )}

              {myReports.map((report) => (

                <div
                  key={report.id}
                  className="rounded-3xl bg-white p-6 shadow-sm"
                >

                  <div className="flex items-center gap-3 ">

                    <div>

                      <h2 className="text-2xl font-semibold text-gray-900">

                        {report.title}

                      </h2>

                      <p className="mt-2 text-gray-600">

                        {report.description}

                      </p>

                    </div>

                    <div
                      className={`rounded-full px-4 py-2 text-sm font-medium ${report.isDeleted
                        ? "bg-red-100 text-red-700"
                        : report.isDiscarded
                          ? "bg-orange-100 text-orange-700"
                          : report.status.name === "Resuelto"
                            ? "bg-green-100 text-green-700"
                            : report.status.name === "En Proceso"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {report.isDeleted
                        ? "Eliminado"
                        : report.isDiscarded
                          ? "Descartado"
                          : report.status.name}
                    </div>

                    {!report.isDeleted &&
                      !report.isDiscarded &&
                      report.status.name === "Pendiente" && (

                        <div className="mt-4 flex gap-3">

                          <button
                            onClick={() => {

                              setEditingReport(report.id);

                              setEditTitle(report.title);

                              setEditDescription(
                                report.description
                              );

                              setEditLocation(
                                report.location
                              );

                            }}
                            className="rounded-xl bg-blue-600 px-4 py-2 text-white"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() => deleteReport(report.id)}
                            className="rounded-xl bg-red-600 px-4 py-2 text-white"
                          >
                            Eliminar
                          </button>

                        </div>

                      )}

                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-3">

                    <div>

                      <p className="text-sm text-gray-500">

                        Ubicación

                      </p>

                      <p className="font-medium text-gray-800">

                        {report.location}

                      </p>

                    </div>

                    <div>

                      <p className="text-sm text-gray-500">

                        Categoría

                      </p>

                      <p className="font-medium text-gray-800">

                        {report.category.name}

                      </p>

                    </div>

                    <div>

                      <p className="text-sm text-gray-500">

                        Fecha

                      </p>

                      <p className="font-medium text-gray-800">

                        {new Date(report.createdAt).toLocaleDateString()}

                      </p>

                    </div>

                  </div>

                  {report.feedback && (

                    <div
                      className={`mt-4 rounded-lg p-3 border ${report.isDeleted
                        ? "border-red-200 bg-red-50"
                        : report.isDiscarded
                          ? "border-orange-200 bg-orange-50"
                          : "border-green-200 bg-green-50"
                        }`}
                    >

                      <p
                        className={`font-semibold ${report.isDeleted
                          ? "text-red-700"
                          : report.isDiscarded
                            ? "text-orange-700"
                            : "text-green-700"
                          }`}
                      >
                        {report.isDeleted
                          ? "Reporte eliminado"
                          : report.isDiscarded
                            ? "Reporte descartado"
                            : "Solución aplicada"}
                      </p>

                      <p className="mt-1 text-sm text-gray-700">
                        {report.feedback}
                      </p>

                    </div>

                  )}
                  {editingReport === report.id && (

                    <div className="mt-6 rounded-2xl bg-gray-50 p-4">

                      <input
                        value={editTitle}
                        onChange={(e) =>
                          setEditTitle(e.target.value)
                        }
                        className="mb-3 w-full rounded-xl border p-3"
                      />

                      <textarea
                        value={editDescription}
                        onChange={(e) =>
                          setEditDescription(e.target.value)
                        }
                        className="mb-3 w-full rounded-xl border p-3"
                      />

                      <input
                        value={editLocation}
                        onChange={(e) =>
                          setEditLocation(e.target.value)
                        }
                        className="mb-3 w-full rounded-xl border p-3"
                      />

                      <div className="flex gap-3">

                        <button
                          onClick={() =>
                            saveReport(report.id)
                          }
                          className="rounded-xl bg-green-600 px-4 py-2 text-white"
                        >
                          Guardar
                        </button>

                        <button
                          onClick={() =>
                            setEditingReport(null)
                          }
                          className="rounded-xl bg-gray-500 px-4 py-2 text-white"
                        >
                          Cancelar
                        </button>

                      </div>

                    </div>

                  )}

                </div>
              ))}

              {supportedReports.length > 0 && (

                <>
                  <h2 className="mt-10 text-2xl font-bold text-gray-900">
                    Reportes apoyados
                  </h2>

                  <div className="space-y-6 mt-4">

                    {supportedReports.map((report) => (

                      <div
                        key={report.id}
                        className="rounded-3xl border-2 border-blue-200 bg-white p-6 shadow-sm"
                      >

                        <div className="flex items-start justify-between">

                          <div>

                            <h2 className="text-2xl font-semibold text-gray-900">
                              {report.title}
                            </h2>

                            <p className="mt-2 text-gray-600">
                              {report.description}
                            </p>

                          </div>

                          <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                            APOYADO
                          </div>

                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-3">

                          <div>
                            <p className="text-sm text-gray-500">
                              Ubicación
                            </p>

                            <p className="font-medium text-gray-800">
                              {report.location}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500">
                              Categoría
                            </p>

                            <p className="font-medium text-gray-800">
                              {report.category.name}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500">
                              Fecha
                            </p>

                            <p className="font-medium text-gray-800">
                              {new Date(report.createdAt).toLocaleDateString()}
                            </p>
                          </div>

                        </div>

                        {report.feedback && (

                          <div
                            className={`mt-4 rounded-lg p-3 border ${report.isDeleted
                              ? "border-red-200 bg-red-50"
                              : report.isDiscarded
                                ? "border-orange-200 bg-orange-50"
                                : "border-green-200 bg-green-50"
                              }`}
                          >

                            <p
                              className={`font-semibold ${report.isDeleted
                                ? "text-red-700"
                                : report.isDiscarded
                                  ? "text-orange-700"
                                  : "text-green-700"
                                }`}
                            >
                              {report.isDeleted
                                ? "Reporte eliminado"
                                : report.isDiscarded
                                  ? "Reporte descartado"
                                  : "Solución aplicada"}
                            </p>

                            <p className="mt-1 text-sm text-gray-700">
                              {report.feedback}
                            </p>

                          </div>

                        )}

                      </div>

                    ))}

                  </div>

                </>

              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}