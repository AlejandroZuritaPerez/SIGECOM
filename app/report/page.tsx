"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function NewReportPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [showCreateAnyway, setShowCreateAnyway] =
    useState(false);
  const [searching, setSearching] = useState(false);
  const [supporting, setSupporting] = useState(false);

  useEffect(() => {

    async function fetchCategories() {

      try {

        const response = await fetch("/api/categories");

        const data = await response.json();

        setCategories(data);

      } catch (error) {

        console.error("Error cargando categorías", error);
      }
    }

    fetchCategories();

  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSearching(true);

    const searchResponse = await fetch(
      "/api/reports/search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: title,
        }),
      }
    );

    const foundReports = await searchResponse.json();

    setSearching(false);

    

    if (foundReports.length > 0) {

      setMatches(foundReports);

      setShowCreateAnyway(true);

      toast.info(
        "Se encontraron reportes similares."
      );

      return;
    }

    const response = await fetch("/api/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        location,
        categoryId,
      }),
    });

    if (response.ok) {
      toast.success("Reporte creado correctamente!");

      router.push("/reports");
    } else {
      toast.error("Error al crear reporte!");
    }
  }

  async function createReportAnyway() {
    const response = await fetch("/api/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        location,
        categoryId,
      }),
    });

    if (response.ok) {
      toast.success("Reporte creado correctamente");
      router.push("/reports");
    } else {
      toast.error("Error al crear reporte");
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-4xl font-bold text-gray-900">
          Nuevo reporte
        </h1>

        <p className="mb-8 text-gray-500">
          Reporta problemas comunitarios de forma rápida y sencilla.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Título
            </label>

            <input
              type="text"
              placeholder="Ejemplo: Bache grande en avenida principal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 p-4 outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Descripción
            </label>

            <textarea
              placeholder="Describe el problema..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-40 w-full rounded-2xl border border-gray-300 p-4 outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Ubicación
            </label>

            <input
              type="text"
              placeholder="Ejemplo: Av. Ejército Mexicano"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 p-4 outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Categoría
            </label>

            <select
              name="categoryId"
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-2xl border border-emerald-400 px-6 py-5 text-2xl outline-none"
            >
              <option value="">
                Selecciona una categoría
              </option>

              {categories.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-emerald-600 py-4 text-lg font-semibold text-white transition hover:bg-emerald-700"
          >
            Crear reporte
          </button>
        </form>
        {matches.length > 0 && (

          <div className="mt-8 rounded-2xl border border-yellow-300 bg-yellow-50 p-6">

            <h2 className="mb-4 text-xl font-bold">

              ¿Este reporte coincide con lo que deseas reportar?

            </h2>

            <div className="space-y-4">

              {matches.map((report) => (

                <div
                  key={report.id}
                  className="rounded-xl border bg-white p-4"
                >

                  <h3 className="font-semibold text-lg">
                    {report.title}
                  </h3>

                  <p className="text-gray-600">
                    {report.description}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    Ubicación: {report.location}
                  </p>

                  <p className="mt-2 font-medium text-emerald-700">
                    Apoyos: {report.supportCount}
                  </p>

                  <button
                    type="button"
                    disabled={supporting}
                    onClick={async () => {

                      try {

                        setSupporting(true);

                        const response = await fetch(
                          "/api/reports/support",
                          {
                            method: "POST",
                            headers: {
                              "Content-Type":
                                "application/json",
                            },
                            body: JSON.stringify({
                              reportId: report.id,
                            }),
                          }
                        );

                        const data =
                          await response.json();

                        if (!response.ok) {

                          toast.error(
                            data.error ||
                            "Error al apoyar reporte"
                          );

                          return;
                        }

                        toast.success(
                          "Te sumaste al reporte"
                        );

                      } catch {

                        toast.error(
                          "Error al apoyar reporte"
                        );

                      } finally {

                        setSupporting(false);

                      }

                    }}
                    className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-white"
                  >
                    Sumarme al reporte
                  </button>

                </div>

              ))}

            </div>

            {showCreateAnyway && (

              <div className="mt-6">

                <button
                  type="button"
                  onClick={createReportAnyway}
                  className="
            w-full
            rounded-xl
            bg-orange-500
            px-6
            py-4
            text-white
            font-semibold
          "
                >

                  Crear reporte por que no coincide con ninguno

                </button>

              </div>

            )}

          </div>

        )}
      </div>
    </main>
  );
}