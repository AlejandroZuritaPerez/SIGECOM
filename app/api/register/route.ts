import { NextResponse } from "next/server"

import bcrypt from "bcryptjs"

import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { name, email, password } = body

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "El usuario ya existe" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return NextResponse.json(user)

  } catch (error) {

    return NextResponse.json(
      { error: "Error al registrar usuario" },
      { status: 500 }
    )
  }
}