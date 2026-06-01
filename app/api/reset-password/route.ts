import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "Token inválido",
        },
        {
          status: 400,
        },
      );
    }

    if (!user.resetTokenExp || user.resetTokenExp < new Date()) {
      return NextResponse.json(
        {
          message: "Token expirado",
        },
        {
          status: 400,
        },
      );
    }

    const samePassword = await bcrypt.compare(password, user.password);

    if (samePassword) {
      return NextResponse.json(
        {
          message: "La nueva contraseña no puede ser igual a la anterior",
        },
        {
          status: 400,
        },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,

        resetToken: null,

        resetTokenExp: null,
      },
    });

    return NextResponse.json({
      message: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Error interno",
      },
      {
        status: 500,
      },
    );
  }
}
