import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Menu } from 'lucide-react';

export default function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="md:hidden text-foreground">
          <Menu className="h-6 w-6" />
          <span className="sr-only">เปิดเมนู</span>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background">
        <SheetHeader>
          <SheetTitle>
            <a href="/" className="text-2xl font-bold text-foreground">
              MBT 16
            </a>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col space-y-6 py-6">
          <NavigationMenu orientation="vertical" className="w-full">
            <NavigationMenuList className="flex-col items-start space-y-4 w-full">
              <NavigationMenuItem className="w-full">
                <NavigationMenuLink
                  href="/news"
                  className="text-foreground hover:text-accent-foreground py-3 px-4 rounded-md hover:bg-accent transition-colors bg-transparent w-full block"
                >
                  ข่าวสาร
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem className="w-full">
                <NavigationMenuLink
                  href="/announcements"
                  className="text-foreground hover:text-accent-foreground py-3 px-4 rounded-md hover:bg-accent transition-colors bg-transparent w-full block"
                >
                  ประกาศ
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem className="w-full">
                <NavigationMenuTrigger className="text-foreground w-full justify-start py-3 px-4">
                  เกี่ยวกับเรา
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-full gap-3 p-4">
                    <li>
                      <NavigationMenuLink
                        href="/about-us"
                        className="block p-2 rounded-md hover:bg-accent text-foreground bg-transparent"
                      >
                        ประวัติหน่วย
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href="/about-us/leadership"
                        className="block p-2 rounded-md hover:bg-accent text-foreground bg-transparent"
                      >
                        ผู้บัญชาการและผู้นำ
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem className="w-full">
                <NavigationMenuTrigger className="text-foreground w-full justify-start py-3 px-4">
                  ไดเรกทอรี
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-full gap-3 p-4">
                    <li>
                      <NavigationMenuLink
                        href="/directory/internal"
                        className="block p-2 rounded-md hover:bg-accent text-foreground bg-transparent"
                      >
                        หน่วยย่อยและแผนกภายใน
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href="/directory/external"
                        className="block p-2 rounded-md hover:bg-accent text-foreground bg-transparent"
                      >
                        เครือข่ายภายนอกและความร่วมมือ
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem className="w-full">
                <NavigationMenuLink
                  href="/document-library"
                  className="text-foreground hover:text-accent-foreground py-3 px-4 rounded-md hover:bg-accent transition-colors bg-transparent w-full block"
                >
                  คลังเอกสาร
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem className="w-full">
                <NavigationMenuLink
                  href="/contact"
                  className="text-foreground hover:text-accent-foreground py-3 px-4 rounded-md hover:bg-accent transition-colors bg-transparent w-full block"
                >
                  ติดต่อ
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </SheetContent>
    </Sheet>
  );
}
