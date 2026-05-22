import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      include: {
        user: true,
        category: true,
        status: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error obteniendo reportes" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const { title, description, location, categoryId } = body;

    if (!title || !description || !location || !categoryId) {
      return NextResponse.json(
        { error: "Campos incompletos" },
        { status: 400 }
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

    const pendingStatus = await prisma.status.findFirst({
      where: {
        name: "Pendiente",
      },
    });

    if (!pendingStatus) {
      return NextResponse.json(
        { error: "Estado Pendiente no encontrado" },
        { status: 404 }
      );
    }

    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    const report = await prisma.report.create({
      data: {
        title,
        description,
        location,
        user: {
          connect: {
            email: session.user.email,
          },
        },
        category: {
          connect: {
            id: category.id,
          },
        },
        status: {
          connect: {
            id: pendingStatus.id,
          },
        },
      },
      include: {
        user: true,
        category: true,
        status: true,
      },
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al crear reporte" },
      { status: 500 }
    );
  }
}