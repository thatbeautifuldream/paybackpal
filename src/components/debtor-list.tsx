"use client";

import { formatCurrency, formatDate } from "@/lib/utils";
import { Debtor } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ExternalLink, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

dayjs.extend(relativeTime);

async function getDebtors() {
  const response = await fetch("/api/debtors", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch debtors");
  }

  return response.json();
}

export default function DebtorList() {
  const {
    data: debtors = [],
    isError,
    error,
    isLoading,
  } = useQuery<Debtor[], Error>({
    queryKey: ["debtors"],
    queryFn: getDebtors,
    select: (data) => {
      return [...data].sort((a, b) => {
        // Sort by createdAt if available, otherwise use remindDate
        const dateA = a.createdAt
          ? new Date(a.createdAt)
          : new Date(a.remindDate);
        const dateB = b.createdAt
          ? new Date(b.createdAt)
          : new Date(b.remindDate);
        return dateB.getTime() - dateA.getTime();
      });
    },
  });

  if (isError) {
    return <div>Error: {error.message}</div>;
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
          <Link
            className="block border p-4 rounded-md transition-colors duration-200 hover:bg-gray-50 hover:border-gray-300 dark:hover:bg-gray-800/50 dark:hover:border-gray-600"
            href={`/debtor/${debtor.uuid}`}
            key={debtor.id}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold">{debtor.name}</h3>
              <ExternalLink size={16} />
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
          </Link>
        ))}
      </ul>
    </div>
  );
}
