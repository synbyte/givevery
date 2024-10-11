import Link from "next/link";

export default function Sidebar({id}) {
  return (
    <aside className="w-64 bg-gradient-to-r from-white via-white to-gray-100 border-r text-black flex flex-col p-4 h-full fixed left-0 top-0">
      <h2 className="text-lg font-bold mb-4">Navigation</h2>
      <nav className="flex flex-col gap-2">
        <Link href={`./${id}/dashboard`}>
          <p className="hover:bg-gray-700 p-2 rounded">Home</p>
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