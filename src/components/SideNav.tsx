import Link from "next/link";
import { Home, LineChart, Package, ShoppingCart, Users } from "lucide-react";

export default function SideNav(props: { textSize: string }) {
  return (
    <div className="flex-1">
      <nav className={`grid items-start px-2 ${props.textSize} font-medium lg:px-4`}>
        <SideNavLink href="#">
          <Home className="w-4 h-4" />
          Home
        </SideNavLink>
        <SideNavLink href="#">
          <ShoppingCart className="w-4 h-4" />
          Search
        </SideNavLink>
        <SideNavLink href="#">
          <Package className="w-4 h-4" />
          Explore{" "}
        </SideNavLink>
        <SideNavLink href="#">
          <Users className="w-4 h-4" />
          Reels
        </SideNavLink>
        <SideNavLink href="#">
          <LineChart className="w-4 h-4" />
          Messages
        </SideNavLink>
        <SideNavLink href="#">
          <LineChart className="w-4 h-4" />
          Messages
        </SideNavLink>
        <SideNavLink href="#">
          <LineChart className="w-4 h-4" />
          Create
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
