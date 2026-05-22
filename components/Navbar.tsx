"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/dashboard", label: "Mi panel" },
  { href: "/report", label: "Nuevo reporte" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const hideOn = ["/login", "/register"];
  if (hideOn.includes(pathname)) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white font-bold text-sm transition group-hover:bg-green-700">
            S
          </div>
          <span className="font-bold text-gray-900 tracking-tight">
            SIGE<span className="text-green-600">COM</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                pathname === href
                  ? "bg-green-50 text-green-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {status === "loading" ? null : session ? (
            <>
              <div className="mr-2 text-right leading-tight">
                <p className="text-sm font-semibold text-gray-900">
                  {session.user?.name ?? "Usuario"}
                </p>
                <p className="text-xs text-gray-500">
                  {session.user?.role ?? "CITIZEN"}
                </p>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="btn-secondary text-sm"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary text-sm">
                Iniciar sesión
              </Link>
              <Link href="/register" className="btn-primary text-sm">
                Crear cuenta
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 md:hidden"
          aria-label="Abrir menú"
        >
          {menuOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 pb-4 md:hidden animate-fade-in">
          <nav className="mt-3 flex flex-col gap-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  pathname === href
                    ? "bg-green-50 text-green-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 flex flex-col gap-2">
            {status === "loading" ? null : session ? (
              <>
                <div className="rounded-2xl bg-gray-50 p-3">
                  <p className="text-sm font-semibold text-gray-900">
                    {session.user?.name ?? "Usuario"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {session.user?.role ?? "CITIZEN"}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    signOut({ callbackUrl: "/login" });
                  }}
                  className="btn-secondary text-sm w-full text-center"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="btn-secondary text-sm w-full text-center"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="btn-primary text-sm w-full text-center"
                >
                  Crear cuenta
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}