"use client";

import { useEffect, useState } from "react";

export default function CommunityReportsPage() {

    const [reports, setReports] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] =
        useState("Todas");

    const categories = [
        "Todas",
        ...new Set(
            reports.map(
                (report) => report.category?.name
            )
        ),
    ];

    const filteredReports =
        selectedCategory === "Todas"
            ? reports
            : reports.filter(
                (report) =>
                    report.category?.name ===
                    selectedCategory
            );

    useEffect(() => {

        async function loadReports() {

            const response =
                await fetch("/api/reports");

            const data =
                await response.json();

            setReports(data);

        }

        loadReports();

    }, []);

    return (

        <main className="min-h-screen bg-gray-100 p-8">

            <h1 className="mb-6 text-4xl font-bold">
                Reportes comunitarios
            </h1>

            <div className="mb-6">

                <label className="mb-2 block font-medium">
                    Filtrar por categoría
                </label>

                <select
                    value={selectedCategory}
                    onChange={(e) =>
                        setSelectedCategory(
                            e.target.value
                        )
                    }
                    className="rounded-lg border p-2"
                >

                    {categories.map((category) => (

                        <option
                            key={category}
                            value={category}
                        >
                            {category}
                        </option>

                    ))}

                </select>

            </div>

            <div className="space-y-4">

                {filteredReports.map((report) => (

                    <div
                        key={report.id}
                        className="rounded-xl bg-white p-5 shadow"
                    >

                        <h2 className="text-xl font-bold">
                            {report.title}
                        </h2>

                        <p className="mt-2">
                            {report.description}
                        </p>

                        <div className="mt-3 text-sm text-gray-500">

                            Categoría:
                            {" "}
                            {report.category?.name}

                        </div>

                        <div className="text-sm text-gray-500">

                            Estado:
                            {" "}

                            {report.isDeleted
                                ? "Eliminado"
                                : report.isDiscarded
                                    ? "Descartado"
                                    : report.status?.name}

                        </div>

                        <div className="text-sm text-gray-500">

                            Apoyos:
                            {" "}
                            {report.supportCount}

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

        </main>

    );

}