"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const debtorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  amount: z.number().min(1, "Amount must be greater than zero"),
  dueDate: z.string().min(1, "Due date is required"),
  remindDate: z.string().min(1, "Remind date is required"),
});

type DebtorFormData = z.infer<typeof debtorSchema>;

export default function AddDebtorForm() {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DebtorFormData>({
    resolver: zodResolver(debtorSchema),
  });

  const handleCopyUrl = (url: string) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.info("URL copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy URL:", err);
        toast.error("Failed to copy URL. Please try again.");
      });
  };

  const { mutate: addDebtor } = useMutation({
    mutationFn: async (data: DebtorFormData) => {
      const response = await fetch("/api/debtors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to add debtor");
      }

      return response.json();
    },
    onSuccess: (newDebtor) => {
      reset();
      queryClient.invalidateQueries({ queryKey: ["debtors"] });
      const url = `${window.location.origin}/debtor/${newDebtor.uuid}`;
      toast.success(
        <div>
          Debtor added successfully.{" "}
          <button
            onClick={() => handleCopyUrl(url)}
            style={{ color: "blue", textDecoration: "underline" }}
          >
            Copy URL
          </button>
        </div>
      );
    },
    onError: (error) => {
      console.error("Error adding debtor:", error);
      toast.error("Error adding debtor. Please try again.");
    },
  });

  const onSubmit: SubmitHandler<DebtorFormData> = (data) => {
    addDebtor(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-8">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} required />
        {errors.name && (
          <p className="text-red-500">{errors.name.message as string}</p>
        )}
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-red-500">{errors.email.message as string}</p>
          )}
        </div>
        <div className="w-full md:w-1/2 px-3">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" {...register("phone")} />
        </div>
      </div>
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          {...register("amount", {
            valueAsNumber: true,
          })}
          required
        />
        {errors.amount && (
          <p className="text-red-500">{errors.amount.message as string}</p>
        )}
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input id="dueDate" type="date" {...register("dueDate")} required />
          {errors.dueDate && (
            <p className="text-red-500">{errors.dueDate.message as string}</p>
          )}
        </div>
        <div className="w-full md:w-1/2 px-3">
          <Label htmlFor="remindDate">Remind Date</Label>
          <Input
            id="remindDate"
            type="date"
            {...register("remindDate")}
            required
          />
          {errors.remindDate && (
            <p className="text-red-500">
              {errors.remindDate.message as string}
            </p>
          )}
        </div>
      </div>
      <Button type="submit">Add Debtor</Button>
    </form>
  );
}
