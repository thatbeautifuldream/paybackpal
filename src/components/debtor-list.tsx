"use client";

import React, { useEffect, useState } from "react";
import { Debtor } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader, LoaderCircle } from "lucide-react";

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
