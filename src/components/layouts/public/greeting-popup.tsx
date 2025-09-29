import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const GreetingPopup: React.FC<{ imageURL: string }> = ({ imageURL }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // In production, show only once per session
    const hasSeen = sessionStorage.getItem("greeting-seen");
    if (!hasSeen) {
      setOpen(true);
      sessionStorage.setItem("greeting-seen", "true");
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "sm:max-w-[720px] p-0 overflow-hidden border-0 bg-transparent",
        )}
      >
        {/* <div className="flex justify-end"> */}
        {/*   <Button onClick={() => setOpen(false)}>Get Started</Button> */}
        {/* </div> */}
        <DialogClose asChild>
          <button className="absolute right-2 top-2 sm:right-3 sm:top-3 rounded-sm focus:outline-none focus:ring focus:ring-primary-foreground disabled:pointer-events-none">
            <XIcon className="w-5 h-5 text-primary-foreground stroke-2" />
            <span className="sr-only">Close</span>
          </button>
        </DialogClose>
        <img
          src={imageURL}
          loading="eager"
          className={"w-full max-w-[720px] h-auto object-contain"}
          width={1920}
          height={1080}
        />
      </DialogContent>
    </Dialog>
  );
};

export default GreetingPopup;
