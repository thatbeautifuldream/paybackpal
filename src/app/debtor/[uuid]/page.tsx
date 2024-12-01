import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import Receipt from "@/components/recipt";

const prisma = new PrismaClient();

async function getDebtor(uuid: string) {
  const debtor = await prisma.debtor.findUnique({
    where: { uuid },
  });

  if (!debtor) {
    notFound();
  }

  return debtor;
}

export default async function DebtorPage(props: {
  params: Promise<{ uuid: string }>;
}) {
  const params = await props.params;
  const uuid = params.uuid;
  const debtor = await getDebtor(uuid);

  return <Receipt debtor={debtor} />;
}
