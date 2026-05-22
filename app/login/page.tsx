"use client";

import { useState } from "react";

import Link from "next/link";

import { signIn } from "next-auth/react";

import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {

    e.preventDefault();

    setError("");

    try {

      setLoading(true);

      const result = await signIn("credentials", {

        email,
        password,

        redirect: false,

      });

      if (result?.error) {

        setError("Correo o contraseña incorrectos");

        return;
      }

      router.push("/dashboard");

    } catch (error) {

      setError("Error al iniciar sesión");

    } finally {

      setLoading(false);

    }
  }

  return (

    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">

        <div className="mb-8 text-center">

          <h1 className="text-3xl font-bold text-gray-900">
            Iniciar sesión
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Accede como ciudadano o administrador
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>

            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Contraseña
            </label>

            <input
              type="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500"
            />

          </div>

          {error && (

            <div className="rounded-2xl bg-red-100 px-4 py-3 text-sm text-red-700">

              {error}

            </div>

          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
          >

            {loading ? "Entrando..." : "Entrar"}

          </button>

        </form>

        <div className="mt-6 text-center text-sm text-gray-600">

          ¿No tienes cuenta?{" "}

          <Link
            href="/register"
            className="font-semibold text-green-600 hover:underline"
          >

            Regístrate aquí

          </Link>

        </div>

      </div>

    </main>
  );
}