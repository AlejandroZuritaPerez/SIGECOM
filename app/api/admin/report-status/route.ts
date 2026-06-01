import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const { reportId, statusName, feedback, isDiscarded, isDeleted } = body;

    const status = await prisma.status.findFirst({
      where: {
        name: statusName,
      },
    });

    if (!status) {
      return NextResponse.json(
        { error: "Estado no encontrado" },
        { status: 404 },
      );
    }

    const updateData: any = {
      statusId: status.id,
      isDiscarded: isDiscarded ?? false,
      isDeleted: isDeleted ?? false,
    };

    if (feedback) {
      updateData.feedback = feedback;
    }

    if (statusName === "En Proceso") {
      updateData.inProgressAt = new Date();
    }

    if (statusName === "Resuelto") {
      updateData.resolvedAt = new Date();
    }

    const updatedReport = await prisma.report.update({
      where: {
        id: reportId,
      },
      data: {
        ...updateData,
        feedback: feedback || null,
      },
    });

    return NextResponse.json(updatedReport);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Error actualizando reporte" },
      { status: 500 },
    );
  }
}
