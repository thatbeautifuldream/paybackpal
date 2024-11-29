import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  // Format the amount to INR
  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(debtor.amount);

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Debt Reminder</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Hello {debtor.name},</p>
          <p className="mb-4">
            This is a reminder about your outstanding debt:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Amount: {formattedAmount}</li>
            <li>Due Date: {new Date(debtor.dueDate).toLocaleDateString()}</li>
          </ul>
          <p>
            Please ensure to make the payment by the due date. If you have any
            questions or concerns, please don&apos;t hesitate to contact us.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
