import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const report = await prisma.report.findUnique({
      where: {
        id: params.id,
      },
      include: {
        status: true,
      },
    });

    if (!report) {
      return NextResponse.json(
        { error: "Reporte no encontrado" },
        { status: 404 }
      );
    }

    if (report.status.name !== "Pendiente") {
      return NextResponse.json(
        { error: "Ya no puede modificarse" },
        { status: 400 }
      );
    }

    const updated = await prisma.report.update({
      where: {
        id: params.id,
      },
      data: {
        title: body.title,
        description: body.description,
        location: body.location,
        categoryId: body.categoryId,
      },
    });

    return NextResponse.json(updated);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error al actualizar" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {

    const report = await prisma.report.findUnique({
      where: {
        id: params.id,
      },
      include: {
        status: true,
      },
    });

    if (!report) {
      return NextResponse.json(
        { error: "Reporte no encontrado" },
        { status: 404 }
      );
    }

    if (report.status.name !== "Pendiente") {
      return NextResponse.json(
        { error: "Ya no puede eliminarse" },
        { status: 400 }
      );
    }

    await prisma.report.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error al eliminar" },
      { status: 500 }
    );
  }
}