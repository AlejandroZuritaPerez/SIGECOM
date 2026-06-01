import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "Texto requerido" },
        { status: 400 }
      );
    }

    const reports = await prisma.report.findMany({
      where: {
        OR: [
          {
            title: {
              contains: text,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: text,
              mode: "insensitive",
            },
          },
          {
            location: {
              contains: text,
              mode: "insensitive",
            },
          },
        ],
      },

      include: {
        category: true,
        status: true,
      },

      take: 10,
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error buscando reportes" },
      { status: 500 }
    );
  }
}