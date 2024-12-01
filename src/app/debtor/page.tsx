import React from "react";
import DebtorList from "@/components/debtor-list";

export default function DebtorsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Debtors</h1>
      <DebtorList />
    </div>
  );
}
