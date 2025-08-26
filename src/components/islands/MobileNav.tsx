import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
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
        <div className="flex flex-col space-y-6 py-6">
          <a href="/" className="text-2xl font-bold text-foreground">
            MBT 16
          </a>

          <nav className="flex flex-col space-y-6 mt-10">
            <a
              href="/news"
              className="text-foreground hover:text-accent-foreground py-3 px-4 rounded-md hover:bg-accent transition-colors bg-transparent"
            >
              ข่าวสาร
            </a>

            <a
              href="/announcements"
              className="text-foreground hover:text-accent-foreground py-3 px-4 rounded-md hover:bg-accent transition-colors bg-transparent"
            >
              ประกาศ
            </a>

            <a
              href="/uni-command"
              className="text-foreground hover:text-accent-foreground py-3 px-4 rounded-md hover:bg-accent transition-colors bg-transparent"
            >
              ทำเนียบผู้บังคับบัญชา
            </a>

            <div className="space-y-3">
              <div className="text-foreground font-medium py-3 px-4">เกี่ยวกับเรา</div>
              <div className="flex flex-col pl-4 space-y-3">
                <a
                  href="/about-us"
                  className="text-foreground hover:text-accent-foreground py-3 px-4 rounded-md hover:bg-accent transition-colors bg-transparent"
                >
                  ประวัติหน่วย
                </a>
                <a
                  href="/about-us/leadership"
                  className="text-foreground hover:text-accent-foreground py-3 px-4 rounded-md hover:bg-accent transition-colors bg-transparent"
                >
                  ผู้บัญชาการและผู้นำ
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-foreground font-medium py-3 px-4">ไดเรกทอรี</div>
              <div className="flex flex-col pl-4 space-y-3">
                <a
                  href="/directory/internal"
                  className="text-foreground hover:text-accent-foreground py-3 px-4 rounded-md hover:bg-accent transition-colors bg-transparent"
                >
                  หน่วยย่อยและแผนกภายใน
                </a>
                <a
                  href="/directory/external"
                  className="text-foreground hover:text-accent-foreground py-3 px-4 rounded-md hover:bg-accent transition-colors bg-transparent"
                >
                  เครือข่ายภายนอกและความร่วมมือ
                </a>
              </div>
            </div>

            <a
              href="/document-library"
              className="text-foreground hover:text-accent-foreground py-3 px-4 rounded-md hover:bg-accent transition-colors bg-transparent"
            >
              คลังเอกสาร
            </a>

            <a
              href="/contact"
              className="text-foreground hover:text-accent-foreground py-3 px-4 rounded-md hover:bg-accent transition-colors bg-transparent"
            >
              ติดต่อ
            </a>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
