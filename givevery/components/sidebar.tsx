import Link from "next/link";

export default function Sidebar({id}:{id: string}) {
  return (
    <aside className="w-64 bg-gradient-to-b from-white  to-gray-100  text-black flex flex-col p-4 h-full fixed left-0 top-0">
      <h2 className="text-lg font-bold mb-4">Navigation</h2>
      <nav className="flex flex-col gap-2 text-sm">
        <Link href={`/protected/${id}/dashboard`}>
          <p className="hover:bg-gray-700 p-2 rounded">Home</p>
        </Link>
        <Link href={`/protected/${id}/transactions`}>
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