import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu } from "@/components/Menu";
import { SideNav } from "@/components/SideNav";

// className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Menu />
      <SideNav />
      <Button>Button</Button>
    </main>
  );
}
