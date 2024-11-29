import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, amount, dueDate, remindDate } = body;

    const newDebtor = await prisma.debtor.create({
      data: {
        name,
        email,
        phone,
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        remindDate: new Date(remindDate),
      },
    });

    return NextResponse.json(newDebtor, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Error creating debtor", message: error },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const debtors = await prisma.debtor.findMany();
    if (debtors.length === 0) {
      return NextResponse.json(
        { message: "No debtors found" },
        { status: 200 }
      );
    }
    return NextResponse.json(debtors);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Error fetching debtors", message: error },
      { status: 500 }
    );
  }
}
