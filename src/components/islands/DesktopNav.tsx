import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

export default function DesktopNav() {
  return (
    <NavigationMenu className="hidden md:block">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="/news"
            className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-foreground"
          >
            ข่าวสาร
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            href="/announcements"
            className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-foreground"
          >
            ประกาศ
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-foreground bg-transparent">
            เกี่ยวกับเรา
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <li>
                <NavigationMenuLink
                  href="/about-us"
                  className="[&>div]:text-sm [&>div]:font-medium block p-2 rounded-md hover:bg-accent text-foreground bg-transparent"
                >
                  <div className="text-sm font-medium">ประวัติหน่วย</div>
                  <p className="text-sm text-muted-foreground">
                    ข้อมูลเกี่ยวกับภารกิจ ค่านิยม และประวัติศาสตร์ของหน่วย
                  </p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink
                  href="/about-us/leadership"
                  className="[&>div]:text-sm [&>div]:font-medium block p-2 rounded-md hover:bg-accent text-foreground bg-transparent"
                >
                  <div className="text-sm font-medium">ผู้บัญชาการและผู้นำ</div>
                  <p className="text-sm text-muted-foreground">
                    ข้อมูลเกี่ยวกับผู้นำและผู้บัญชาการของหน่วย
                  </p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink
                  href="/uni-command"
                  className="[&>div]:text-sm [&>div]:font-medium block p-2 rounded-md hover:bg-accent text-foreground bg-transparent"
                >
                  <div className="text-sm font-medium">ทำเนียบผู้บังคับบัญชา</div>
                  <p className="text-sm text-muted-foreground">สำรวจสายการบังคับบัญชาของหน่วย</p>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-foreground bg-transparent">
            ไดเรกทอรี
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <li>
                <NavigationMenuLink
                  href="/directory/internal"
                  className="[&>div]:text-sm [&>div]:font-medium block p-2 rounded-md hover:bg-accent text-foreground bg-transparent"
                >
                  <div className="text-sm font-medium">หน่วยย่อยและแผนกภายใน</div>
                  <p className="text-sm text-muted-foreground">ไดเรกทอรีของหน่วยย่อยและแผนกภายใน</p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink
                  href="/directory/external"
                  className="[&>div]:text-sm [&>div]:font-medium block p-2 rounded-md hover:bg-accent text-foreground bg-transparent"
                >
                  <div className="text-sm font-medium">เครือข่ายภายนอกและความร่วมมือ</div>
                  <p className="text-sm text-muted-foreground">
                    ไดเรกทอรีของเครือข่ายภายนอกและความร่วมมือ
                  </p>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            href="/document-library"
            className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-foreground"
          >
            คลังเอกสาร
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            href="/contact"
            className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-foreground"
          >
            ติดต่อ
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
