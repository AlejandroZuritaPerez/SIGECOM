import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import { prisma } from "@/lib/prisma";

export async function GET() {

  try {

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {

      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {

      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const reports = await prisma.report.findMany({

      where: {
        userId: user.id,
      },

      include: {
        status: true,
        category: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reports);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Error al obtener reportes" },
      { status: 500 }
    );
  }
}