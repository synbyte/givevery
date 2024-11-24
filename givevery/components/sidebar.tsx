'use client'
import Link from "next/link";
import { useNonprofit } from "@/app/NonprofitContext";
import Image from "next/image";
import logo from "@/app/logo.svg"
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { memo } from "react";

const Sidebar = memo(function Sidebar() {
  const pathname = usePathname();
    const { nonprofitId, connectedAccountId } = useNonprofit();


  return (
    <aside className="flex fixed top-0 left-0 flex-col p-4 w-64 h-full text-black bg-gradient-to-b from-white to-lime-50 border-r">
      <div className="flex justify-start p-2">
        <Image className="mx-auto w-1/2" width={808} height={523} alt="Givevery Logo"  src={logo}></Image>
        </div>
      <nav className="flex flex-col gap-2 text-md">
        <Link href={`/protected/`}>
          <p className={cn("p-2 rounded hover:bg-lime-400 transition-all", pathname === "/protected" && "font-bold ring-2 ring-lime-500")}>Home</p>
        </Link>
        <Link href={`/protected/transactions`}>
          <p className={cn("p-2 rounded hover:bg-lime-400 transition-all", pathname === "/protected/transactions" && "font-bold ring-2 ring-lime-500")}>Transactions</p>
        </Link>
        <Link href="/protected/form">
          <p className={cn("p-2 rounded hover:bg-lime-400 transition-all", pathname === "/protected/form" && "font-bold ring-2 ring-lime-500")}>Donation Form</p>
        </Link>
        <Link href="/donate/123">
          <p>Donate</p>
        </Link>
        
      </nav>
    </aside>
  );
})

export default Sidebar;