import { Debtor } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getDebtors() {
  const response = await fetch("/api/debtors", {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch debtors");
  }
  return response.json();
}

export default async function DebtorList() {
  const debtors: Debtor[] = await getDebtors();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Debtors List</h2>
      <ul className="space-y-4">
        {debtors.map((debtor) => (
          <li key={debtor.id} className="border p-4 rounded-md">
            <h3 className="font-bold">{debtor.name}</h3>
            <p>Amount: ${debtor.amount.toFixed(2)}</p>
            <p>Due Date: {new Date(debtor.dueDate).toLocaleDateString()}</p>
            <p>
              Remind Date: {new Date(debtor.remindDate).toLocaleDateString()}
            </p>
            <Link href={`/debtor/${debtor.uuid}`} passHref>
              <Button className="mt-2">View Public Page</Button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
