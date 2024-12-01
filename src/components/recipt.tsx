import React from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface ReceiptProps {
  debtor: {
    name: string;
    amount: number;
    dueDate: Date;
  };
}

export default function Receipt({ debtor }: ReceiptProps) {
  const formattedAmount = formatCurrency(debtor.amount);
  const dueDate = new Date(debtor.dueDate);
  const dueDateString = formatDate(dueDate);
  const relativeDueDate = dayjs(dueDate).fromNow();

  return (
    <div className="container mx-auto p-4 flex justify-center">
      <div className="w-80 bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden">
        <div className="px-4 py-6 font-mono text-sm leading-tight">
          <div className="font-bold text-lg mb-4 border-b pb-2">
            Payment Reminder
          </div>
          <div className="space-y-1">
            <p>Hi {debtor.name},</p>
            <p>Date: {formatDate(new Date())}</p>
          </div>
          <div className="my-4 border-t border-b py-2 border-dashed">
            <p className="font-bold">Payment Details:</p>
            <p>Amount: {formattedAmount}</p>
            <p>Due Date: {dueDateString}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              (due {relativeDueDate})
            </p>
          </div>
          <p className="text-[0.6rem] text-gray-600 dark:text-gray-400">
            I hope this message finds you well. I&apos;m writing to kindly
            remind you about the outstanding payment mentioned above. I would
            greatly appreciate it if you could settle this amount by the due
            date. If you&apos;ve already processed the payment, please let me
            know. If you&apos;re experiencing any difficulties, feel free to
            reach out to discuss this further.
          </p>
          <div className="mt-4 text-xs">
            <p>Best regards,</p>
            <p className="mt-1 font-bold">John Doe</p>
          </div>
        </div>
      </div>
    </div>
  );
}
