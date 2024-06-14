import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center gap-6 p-24 min-h-screen">
      <h1 className="font-bold text-3xl text-center md:text-5xl leading-tight lg:leading-[1.1] tracking-tighter">
        Welcome to Postbook
      </h1>
      <Link className={buttonVariants({ variant: "default" }) + " px-10 "} href="/feed">
        The action is here
      </Link>
    </main>
  );
}
