import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { formatCurrency, formatDate } from "@/lib/utils";

dayjs.extend(relativeTime);

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

  const formattedAmount = formatCurrency(debtor.amount);
  const dueDate = new Date(debtor.dueDate);
  const dueDateString = formatDate(dueDate);

  const relativeDueDate = dayjs(dueDate).fromNow();

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
            <li>
              Due Date: {dueDateString} ({relativeDueDate})
            </li>
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
