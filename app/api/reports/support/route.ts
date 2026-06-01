import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {

  try {

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {

      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const { reportId } = await req.json();

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

    const existingSupport =
      await prisma.reportSupport.findUnique({
        where: {
          reportId_userId: {
            reportId,
            userId: user.id,
          },
        },
      });

    if (existingSupport) {

      return NextResponse.json(
        {
          error:
            "Ya apoyaste este reporte",
        },
        {
          status: 400,
        }
      );
    }

    await prisma.reportSupport.create({
      data: {
        reportId,
        userId: user.id,
      },
    });

    await prisma.report.update({
      where: {
        id: reportId,
      },
      data: {
        supportCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Error al apoyar reporte",
      },
      {
        status: 500,
      }
    );
  }
}