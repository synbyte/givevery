'use client'
import Link from "next/link";
import { useNonprofit } from "@/app/NonprofitContext";
import Image from "next/image";
import logo from "@/app/logo.svg"

export default function Sidebar() {
    const { nonprofitId, connectedAccountId } = useNonprofit();


  return (
    <aside className="w-64 bg-gradient-to-b from-white to-gray-100  text-black flex flex-col p-4 h-full fixed left-0 top-0">
      <div className="flex justify-start p-2">
        <Image className="w-1/2 mx-auto" width={808} height={523} alt="Givevery Logo"  src={logo}></Image>
        </div>
      <nav className="flex flex-col gap-2 text-md ">
        <Link href={`/protected/`}>
          <p className="hover:bg-lime-400 p-2 rounded">Home</p>
        </Link>
        <Link href={`/protected/transactions`}>
          <p className="hover:bg-lime-400 p-2 rounded">Transactions</p>
        </Link>
        <Link href="/protected/form">
          <p className="hover:bg-lime-400 p-2 rounded">Donation Form</p>
        </Link>
        <Link href="/settings">
          <p className="hover:bg-lime-400 p-2 rounded"> </p>
        </Link>
        <Link href="/donate/123">
          <p>Donate</p>
        </Link>
        
      </nav>
    </aside>
  );
}