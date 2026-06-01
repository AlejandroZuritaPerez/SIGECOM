"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function ResetPasswordPage() {
  const params = useParams();

  const token = params.token as string;

  const [password, setPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      password !==
      confirmPassword
    ) {
      setMessage(
        "Las contraseñas no coinciden"
      );
      return;
    }

    const res = await fetch(
      "/api/reset-password",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      }
    );

    const data = await res.json();

    setMessage(data.message);

    if (res.ok) {
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-3xl font-bold mb-6">
        Nueva contraseña
      </h1>

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-4"
      >
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={
            confirmPassword
          }
          onChange={(e) =>
            setConfirmPassword(
              e.target.value
            )
          }
          className="w-full border p-3 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded"
        >
          Cambiar contraseña
        </button>
      </form>

      {message && (
        <p className="mt-4">
          {message}
        </p>
      )}
    </div>
  );
}