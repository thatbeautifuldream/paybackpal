"use client";

import { formatCurrency, formatDate } from "@/lib/utils";
import { Debtor } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ExternalLink, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

dayjs.extend(relativeTime);

function getDebtors() {
  return fetch("/api/debtors", {
    method: "GET",
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch debtors");
    }
    return response.json();
  });
}

export default function DebtorList() {
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDebtors()
      .then((data) => {
        setDebtors(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center animate-spin">
        <LoaderCircle className="h-7 w-7" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Debtors List</h2>
      <ul className="space-y-4">
        {debtors.map((debtor) => (
          <li key={debtor.id} className="border p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold">{debtor.name}</h3>
              <Link href={`/debtor/${debtor.uuid}`}>
                <ExternalLink size={16} />
              </Link>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Amount: {formatCurrency(debtor.amount)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Due Date: {formatDate(new Date(debtor.dueDate))} (
              {dayjs(new Date(debtor.dueDate)).fromNow()})
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Remind Date: {formatDate(new Date(debtor.remindDate))} (
              {dayjs(new Date(debtor.remindDate)).fromNow()})
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
