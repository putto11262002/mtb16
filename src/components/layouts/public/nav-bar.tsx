import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { ModeToggle } from "../../common/mode-toggle";

const navigationItems = [
  { title: "เกี่ยวกับ", href: "/about" },
  { title: "ข่าว", href: "/news" },
  { title: "ประกาศ", href: "/announcements" },
  { title: "สารบบหน่วยงาน", href: "/directory" },
  { title: "ผู้นำ", href: "/leadership" },
  { title: "ทรัพยากร", href: "/resources" },
];

export function Navbar() {
  return (
    <>
      {/* Desktop Navigation */}
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList>
          {navigationItems.map((item) => (
            <NavigationMenuItem key={item.href}>
              <NavigationMenuLink
                href={item.href}
                className={cn(
                  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                )}
              >
                {item.title}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Mobile Navigation */}
      <div className="flex flex-1 items-center justify-end md:hidden">
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-screen max-w-none border-0 rounded-none mt-2"
            align="start"
            sideOffset={8}
          >
            <div className="px-4 py-2 border-b">
              <h2 className="text-lg font-semibold">16th Military Circle</h2>
            </div>
            <div className="py-2">
              {navigationItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <a href={item.href} className="w-full cursor-pointer">
                    {item.title}
                  </a>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}

export default Navbar;
