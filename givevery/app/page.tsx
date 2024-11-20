import logo from "@/app/logo.svg";
import Image from "next/image";

export default async function Index() {
  return (
    <>
      <main className="flex-1 flex flex-col w-1/2 mx-auto h-full justify-center gap-6 px-4">
        <p className="text-5xl">Welcome to</p>
        <Image className="flex mx-auto" alt="Givevery logo" src={logo}></Image>
        <p className="flex text-5xl justify-end">Sign up to get started!</p>
      </main>
    </>
  );
}
