'use client'
import Link from "next/link";
import { useNonprofit } from "@/app/NonprofitContext";

export default function Sidebar() {
    const { nonprofitId, connectedAccountId } = useNonprofit();


  return (
    <aside className="w-64 bg-gradient-to-b from-white to-gray-100  text-black flex flex-col p-4 h-full fixed left-0 top-0">
      <h2 className="text-lg font-bold mb-4">Navigation</h2>
      <nav className="flex flex-col gap-2 text-sm">
        <Link href={`/protected/`}>
          <p className="hover:bg-gray-700 p-2 rounded">Home</p>
        </Link>
        <Link href={`/protected/transactions`}>
          <p className="hover:bg-gray-700 p-2 rounded">Transactions</p>
        </Link>
        <Link href="/profile">
          <p className="hover:bg-gray-700 p-2 rounded">Donation Forms</p>
        </Link>
        <Link href="/settings">
          <p className="hover:bg-gray-700 p-2 rounded"> </p>
        </Link>
        
      </nav>
    </aside>
  );
}