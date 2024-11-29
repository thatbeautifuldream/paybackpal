"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AddDebtorForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    amount: "",
    dueDate: "",
    remindDate: "",
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/debtors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const newDebtor = await response.json();
        setFormData({
          name: "",
          email: "",
          phone: "",
          amount: "",
          dueDate: "",
          remindDate: "",
        });
        router.refresh();
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
      }
    } catch (error) {
      console.error("Error adding debtor:", error);
      toast.error("Error adding debtor. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="remindDate">Remind Date</Label>
        <Input
          id="remindDate"
          name="remindDate"
          type="date"
          value={formData.remindDate}
          onChange={handleChange}
          required
        />
      </div>
      <Button type="submit">Add Debtor</Button>
    </form>
  );
}
