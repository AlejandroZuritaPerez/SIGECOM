import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({
        message: "Si el correo existe, se enviará la recuperación.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    const expiration = new Date(Date.now() + 1000 * 60 * 30);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        resetToken: token,
        resetTokenExp: expiration,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: user.email,
      subject: "Recuperación de contraseña SIGECOM",
      html: `
    <h2>Recuperación de contraseña</h2>

    <p>
      Haz clic en el siguiente enlace para cambiar tu contraseña:
    </p>

    <a href="${resetUrl}">
      Restablecer contraseña
    </a>

    <p>
      Este enlace expira en 30 minutos.
    </p>
  `,
    });
    
    console.log("TOKEN:", token);

    return NextResponse.json({
      message: "Correo de recuperación enviado.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Error interno.",
      },
      {
        status: 500,
      },
    );
  }
}
