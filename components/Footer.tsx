import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">

          {/* Marca -->*/}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-600 text-white font-bold text-xs">
              S
            </div>
            <span className="font-bold text-gray-900 text-sm tracking-tight">
              SIGE<span className="text-green-600">COM</span>
            </span>
            <span className="text-gray-400 text-xs">
              · Sistema de Gestión Comunitaria
            </span>
          </div>

          {/* Links -->*/}
          <nav className="flex items-center gap-4 text-xs text-gray-500">
            <Link href="/" className="hover:text-gray-900 transition">
              Inicio
            </Link>
            <Link href="/login" className="hover:text-gray-900 transition">
              Iniciar sesión
            </Link>
            <Link href="/register" className="hover:text-gray-900 transition">
              Registrarse
            </Link>
          </nav>

          {/* Créditos -->*/}
          <p className="text-xs text-gray-400">
            © {year} Municipio de Boca del Río, Ver.
          </p>
        </div>
      </div>
    </footer>
  );
}
