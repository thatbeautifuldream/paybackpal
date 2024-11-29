import AddDebtorForm from "@/components/add-debtor-form";
import DebtorList from "@/components/debtor-list";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Money Reminder App</h1>
      <AddDebtorForm />
      <DebtorList />
    </div>
  );
}
