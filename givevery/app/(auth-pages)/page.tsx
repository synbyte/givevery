import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Index() {
  return (
    <>
      <main className=" flex flex-col justify-center items-center h-screen gap-6 px-4">
        <p className="text-5xl font-bold">Givevery</p>
        <div className="flex gap-5">
        <Link href='/sign-in'><Button>Sign-In</Button></Link>
        <Link href='/sign-up'><Button>Sign-Up</Button></Link>
        </div>
        
      </main>
    </>
  );
}
