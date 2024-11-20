'use client'
import Link from "next/link";
import { useNonprofit } from "@/app/NonprofitContext";
import Image from "next/image";
import logo from "@/app/logo.svg"
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

export default function Sidebar() {
  const pathname = usePathname();
    const { nonprofitId, connectedAccountId } = useNonprofit();


  return (
    <aside className="w-64 bg-gradient-to-b border-r from-white to-lime-50  text-black flex flex-col p-4 h-full fixed left-0 top-0">
      <div className="flex justify-start p-2">
        <Image className="w-2/3" width={808} height={523} alt="Givevery Logo"  src={logo}></Image>
        </div>
      <nav className="flex flex-col gap-2 text-md ">
        <Link href={`/protected/`}>
          <p className={cn("p-2 rounded hover:bg-lime-400", pathname === "/protected" && "font-bold ring-2 ring-lime-500")}>Home</p>
        </Link>
        <Link href={`/protected/transactions`}>
          <p className={cn("p-2 rounded hover:bg-lime-400", pathname === "/protected/transactions" && "font-bold ring-2 ring-lime-500")}>Transactions</p>
        </Link>
        <Link href="/protected/form">
          <p className={cn("p-2 rounded hover:bg-lime-400", pathname === "/protected/form" && "font-bold ring-2 ring-lime-500")}>Donation Form</p>
        </Link>
        <Link href="/settings">
          <p className={cn("p-2 rounded hover:bg-lime-400", pathname === "/protected/settings" && "font-bold ring-2 ring-lime-500")}> </p>
        </Link>
        
      </nav>
    </aside>
  );
}