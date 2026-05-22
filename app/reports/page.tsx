"use client";

import { useEffect, useState } from "react";

type Report = {
  id: string;
  title: string;
  description: string;
  location: string;

  category: {
    name: string;
  };

  status: {
    name: string;
  };

  createdAt: string;
};

export default function ReportsPage() {

  const [reports, setReports] = useState<Report[]>([]);

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

          {reports.length === 0 ? (

            <div className="rounded-3xl bg-white p-10 shadow-sm">

              <p className="text-gray-500">

                Aún no tienes reportes registrados.

              </p>

            </div>

          ) : (

            reports.map((report) => (

              <div
                key={report.id}
                className="rounded-3xl bg-white p-6 shadow-sm"
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

                  <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">

                    {report.status.name}

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

              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}