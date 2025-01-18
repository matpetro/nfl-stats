import { StatTable } from "@/components/StatTable";
import Image from "next/image";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">NFL Player Statistics</h1>
      <StatTable />
    </main>
  );
}
