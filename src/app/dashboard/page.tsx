import Link from "next/link";
import { CircleUser, Home, LineChart, Menu, Package, Package2, Search, ShoppingCart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

//use zod
type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type Comment = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
};

export default async function Dashboard() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts/");
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  const posts = (await res.json()) as Array<Post>;

  return (
    <div className="flex flex-col items-stretch w-full h-screen">
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
      <div className="flex-1 grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] min-h-0">
        <div className="md:block hidden bg-muted/40 border-r">
          <SideNav textSize="text-sm" />
        </div>
        <main className="flex flex-col gap-4 lg:gap-6 p-4 lg:p-6 overflow-y-scroll">
          <div className="flex items-center">
            <h1 className="font-semibold text-lg md:text-2xl">Feed</h1>
          </div>
          <div className="flex flex-col flex-1 justify-center items-stretch gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function SideNav(props: { textSize: string }) {
  return (
    <div className="flex-1">
      <nav className={`grid items-start px-2 ${props.textSize} font-medium lg:px-4`}>
        <SideNavLink href="#">
          <Home className="w-4 h-4" />
          Dashboard
        </SideNavLink>
        <SideNavLink href="#">
          <ShoppingCart className="w-4 h-4" />
          Orders
        </SideNavLink>
        <SideNavLink href="#">
          <Package className="w-4 h-4" />
          Products{" "}
        </SideNavLink>
        <SideNavLink href="#">
          <Users className="w-4 h-4" />
          Customers
        </SideNavLink>
        <SideNavLink href="#">
          <LineChart className="w-4 h-4" />
          Analytics
        </SideNavLink>
      </nav>
    </div>
  );
}

function SideNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-primary transition-all"
    >
      {children}
    </Link>
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
            placeholder="Search products..."
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

function CommentCard(props: Comment) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.name}</CardTitle>
        <CardDescription>{props.email.split("@")[0]}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{props.body}</p>
      </CardContent>
    </Card>
  );
}

function PostCard(props: Post) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{props.userId}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{props.body}</p>
      </CardContent>
      <CardFooter>
        <PostDialog {...props} />
      </CardFooter>
    </Card>
  );
}

export async function PostDialog(props: Post) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${props.id}/comments`);
  const comments = [] as Array<Comment>;

  if (res.ok) {
    comments.push(...(await res.json()));
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>View</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1025px] h-5/6">
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogDescription>{props.userId}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 grid md:grid-cols-[1fr_220px] lg:grid-cols-[1fr_280px] min-h-0">
          <div>
            <p>{props.body}</p>
          </div>
          {/* //loader skeleton */}
          <div className="h-full overflow-y-scroll [@media(min-width:767px)]:scrollbar-hide">
            {comments.map((comment) => (
              <CommentCard key={comment.id} {...comment} />
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
