import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
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
      <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background p-6">
        <SheetHeader className="p-0 mb-6">
          <SheetTitle asChild>
            <a href="/" className="text-2xl font-bold text-foreground">
              MBT 16
            </a>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col space-y-3">
          <a
            href="/news"
            className="text-foreground hover:text-accent-foreground py-2 px-3 rounded-md hover:bg-accent transition-colors bg-transparent text-lg"
          >
            ข่าวสาร
          </a>

          <a
            href="/announcements"
            className="text-foreground hover:text-accent-foreground py-2 px-3 rounded-md hover:bg-accent transition-colors bg-transparent text-lg"
          >
            ประกาศ
          </a>

          <div className="space-y-2 pt-2">
            <div className="text-foreground font-semibold py-2 px-3 text-lg">เกี่ยวกับเรา</div>
            <div className="flex flex-col pl-4 space-y-2">
              <a
                href="/about-us"
                className="text-muted-foreground hover:text-accent-foreground py-2 px-3 rounded-md hover:bg-accent transition-colors bg-transparent"
              >
                ประวัติหน่วย
              </a>
              <a
                href="/about-us/leadership"
                className="text-muted-foreground hover:text-accent-foreground py-2 px-3 rounded-md hover:bg-accent transition-colors bg-transparent"
              >
                ผู้บัญชาการและผู้นำ
              </a>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="text-foreground font-semibold py-2 px-3 text-lg">ไดเรกทอรี</div>
            <div className="flex flex-col pl-4 space-y-2">
              <a
                href="/directory/internal"
                className="text-muted-foreground hover:text-accent-foreground py-2 px-3 rounded-md hover:bg-accent transition-colors bg-transparent"
              >
                หน่วยย่อยและแผนกภายใน
              </a>
              <a
                href="/directory/external"
                className="text-muted-foreground hover:text-accent-foreground py-2 px-3 rounded-md hover:bg-accent transition-colors bg-transparent"
              >
                เครือข่ายภายนอกและความร่วมมือ
              </a>
            </div>
          </div>

          <a
            href="/document-library"
            className="text-foreground hover:text-accent-foreground py-2 px-3 rounded-md hover:bg-accent transition-colors bg-transparent text-lg"
          >
            คลังเอกสาร
          </a>

          <a
            href="/contact"
            className="text-foreground hover:text-accent-foreground py-2 px-3 rounded-md hover:bg-accent transition-colors bg-transparent text-lg"
          >
            ติดต่อ
          </a>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
