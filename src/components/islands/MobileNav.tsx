import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="md:hidden text-foreground" onClick={() => setIsOpen(true)}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">เปิดเมนู</span>
        </button>
      </SheetTrigger>
      <SheetContent side="top" className="bg-background">
        <SheetHeader>
          <SheetTitle>
            <a href="/" className="text-2xl font-bold text-foreground" onClick={() => setIsOpen(false)}>
              MBT 16
            </a>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col space-y-2 p-4" data-testid="mobile-nav-content">
          <a
            href="/news"
            className="text-foreground hover:text-accent-foreground py-2 px-3 rounded-md hover:bg-accent transition-colors text-lg"
            onClick={() => setIsOpen(false)}
          >
            ข่าวสาร
          </a>
          <a
            href="/announcements"
            className="text-foreground hover:text-accent-foreground py-2 px-3 rounded-md hover:bg-accent transition-colors text-lg"
            onClick={() => setIsOpen(false)}
          >
            ประกาศ
          </a>
          <details className="group">
            <summary className="text-foreground hover:text-accent-foreground py-2 px-3 rounded-md hover:bg-accent transition-colors text-lg flex justify-between items-center cursor-pointer list-none">
              <span>เกี่ยวกับเรา</span>
              <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
            </summary>
            <div className="pl-4 mt-2 space-y-2">
              <a
                href="/about-us"
                className="block text-foreground hover:text-accent-foreground py-2 px-3 rounded-md hover:bg-accent transition-colors"
                onClick={() => setIsOpen(false)}
              >
                ประวัติหน่วย
              </a>
              <a
                href="/about-us/leadership"
                className="block text-foreground hover:text-accent-foreground py-2 px-3 rounded-md hover:bg-accent transition-colors"
                onClick={() => setIsOpen(false)}
              >
                ผู้บัญชาการและผู้นำ
              </a>
            </div>
          </details>
          <details className="group">
            <summary className="text-foreground hover:text-accent-foreground py-2 px-3 rounded-md hover:bg-accent transition-colors text-lg flex justify-between items-center cursor-pointer list-none">
              <span>ไดเรกทอรี</span>
              <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
            </summary>
            <div className="pl-4 mt-2 space-y-2">
              <a
                href="/directory/internal"
                className="block text-foreground hover:text-accent-foreground py-2 px-3 rounded-md hover:bg-accent transition-colors"
                onClick={() => setIsOpen(false)}
              >
                หน่วยย่อยและแผนกภายใน
              </a>
              <a
                href="/directory/external"
                className="block text-foreground hover:text-accent-foreground py-2 px-3 rounded-md hover:bg-accent transition-colors"
                onClick={() => setIsOpen(false)}
              >
                เครือข่ายภายนอกและความร่วมมือ
              </a>
            </div>
          </details>
          <a
            href="/document-library"
            className="text-foreground hover:text-accent-foreground py-2 px-3 rounded-md hover:bg-accent transition-colors text-lg"
            onClick={() => setIsOpen(false)}
          >
            คลังเอกสาร
          </a>
          <a
            href="/contact"
            className="text-foreground hover:text-accent-foreground py-2 px-3 rounded-md hover:bg-accent transition-colors text-lg"
            onClick={() => setIsOpen(false)}
          >
            ติดต่อ
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
