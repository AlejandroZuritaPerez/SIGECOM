import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700">
              SIGECOM · Plataforma Web Municipal
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">
              Reporta y da seguimiento a problemas comunitarios de forma fácil,
              rápida y ordenada.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-gray-600 sm:text-lg">
              Plataforma web para que los ciudadanos registren incidencias como
              baches, fugas, alumbrado o limpieza, y el personal administrativo
              pueda dar seguimiento, asignar responsables y actualizar estados.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="rounded-2xl bg-green-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-green-700"
              >
                Crear cuenta
              </Link>

              <Link
                href="/login"
                className="rounded-2xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100"
              >
                Iniciar sesión
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-500">Registro</p>
                <p className="mt-1 font-semibold">Ciudadano</p>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-500">Seguimiento</p>
                <p className="mt-1 font-semibold">En tiempo real</p>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-500">Gestión</p>
                <p className="mt-1 font-semibold">Administrador</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-bold">¿Qué puedes hacer aquí?</h2>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="font-semibold">1. Registrar un reporte</p>
                <p className="mt-1 text-sm text-gray-600">
                  Describe el problema, elige la categoría y envíalo al sistema.
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="font-semibold">2. Consultar su estado</p>
                <p className="mt-1 text-sm text-gray-600">
                  Revisa si está pendiente, en proceso o resuelto.
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="font-semibold">3. Administrar incidencias</p>
                <p className="mt-1 text-sm text-gray-600">
                  El administrador asigna responsables y actualiza el avance.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-dashed border-gray-300 p-4 text-sm text-gray-500">
              Pensado para una arquitectura cliente-servidor con frontend,
              lógica de negocio y base de datos separada.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}