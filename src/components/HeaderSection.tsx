import { Button } from "./ui/button";
import { Comment } from "@/types/Comment";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { CircleUser, Home, LineChart, Menu, Package, Package2, Search, ShoppingCart, Users } from "lucide-react";
import SideNav from "./SideNav";

export default function HeaderSection() {
  return (
    <div className="flex flex-row justify-between items-center border-b h-14 lg:h-[60px]">
      <SideDrawer />
      <div className="px-4 lg:px-6 md:w-[220px] lg:w-[280px]">
        <LogoLink srOnlyText={false} />
      </div>
      <header className="flex flex-1 gap-4 bg-muted/40 px-4 lg:px-6 py-2">
        <SearchBar />
        <AccountOptions />
      </header>
    </div>
  );
}

function SideDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden shrink-0">
          <Menu className="w-5 h-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <LogoLink srOnlyText={true} />
        <SideNav textSize="text-lg" />
      </SheetContent>
    </Sheet>
  );
}

function SearchBar() {
  return (
    <div className="flex-1 w-full">
      <form>
        <div className="relative">
          <Search className="top-2.5 left-2.5 absolute w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search posts..."
            className="bg-background shadow-none pl-8 w-full md:w-2/3 lg:w-1/3 appearance-none"
          />
        </div>
      </form>
    </div>
  );
}

function AccountOptions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <CircleUser className="w-5 h-5" />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LogoLink({ srOnlyText }: { srOnlyText: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
      <Package2 className="w-6 h-6" />
      <span className={srOnlyText ? "sr-only" : ""}>Postbook</span>
    </Link>
  );
}
