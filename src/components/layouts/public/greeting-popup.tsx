import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const GreetingPopup: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Show popup on mount, but only if not shown before in this session
    const hasSeen = sessionStorage.getItem("greeting-seen");
    if (!hasSeen) {
      setOpen(true);
      sessionStorage.setItem("greeting-seen", "true");
    }
    return () => {
      sessionStorage.setItem("greeting-seen", "true");
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className={cn("sm:max-w-[720px] p-0 overflow-hidden border-0")}
      >
        {/* <div className="flex justify-end"> */}
        {/*   <Button onClick={() => setOpen(false)}>Get Started</Button> */}
        {/* </div> */}
        <AspectRatio className="relative" ratio={16 / 9}>
          <DialogClose asChild>
            <button className="absolute right-2 top-2 sm:right-3 sm:top-3 rounded-sm focus:outline-none focus:ring focus:ring-primary-foreground disabled:pointer-events-none">
              <XIcon className="w-5 h-5 text-primary-foreground stroke-2" />
              <span className="sr-only">Close</span>
            </button>
          </DialogClose>
          {children}
        </AspectRatio>
      </DialogContent>
    </Dialog>
  );
};

export default GreetingPopup;
