import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  props: { params: Promise<{ uuid: string }> }
) {
  const params = await props.params;
  const uuid = params.uuid;

  try {
    const debtor = await prisma.debtor.findUnique({
      where: {
        uuid,
      },
    });

    if (!debtor) {
      return NextResponse.json({ error: "Debtor not found" }, { status: 404 });
    }

    return NextResponse.json(debtor);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Error fetching debtor", message: error },
      { status: 500 }
    );
  }
}
