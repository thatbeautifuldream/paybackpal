import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
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
      <div className="max-w-md mx-auto border-2 border-gray-300 p-4 shadow-lg dark:border-gray-700 bg-white dark:bg-gray-900 font-mono">
        <h1 className="text-center text-lg font-bold mb-4 dark:text-white">
          Debt Receipt
        </h1>
        <p>
          Debtor: <strong>{debtor.name}</strong>
        </p>
        <p>
          Date: <strong>{formatDate(new Date())}</strong>
        </p>
        <hr className="my-2 dark:border-gray-700" />
        <p>Outstanding Debt Details:</p>
        <p>
          Amount Due: <strong>{formattedAmount}</strong>
        </p>
        <p>
          Due Date: <strong>{dueDateString}</strong> ({relativeDueDate})
        </p>
        <hr className="my-2 dark:border-gray-700" />
        <p className="text-xs dark:text-gray-400">
          Timely repayment of your debt is crucial for maintaining financial
          health and avoiding potential penalties. Both parties benefit from
          prompt settlement, ensuring continued good relations and financial
          stability. Please ensure to make the payment by the due date. For any
          inquiries, contact us.
        </p>
      </div>
    </div>
  );
}
