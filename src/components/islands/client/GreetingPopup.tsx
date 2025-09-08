import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function GreetingPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Show popup on mount, but only if not shown before in this session
    const hasSeen = sessionStorage.getItem("greeting-seen");
    if (!hasSeen) {
      setOpen(true);
      sessionStorage.setItem("greeting-seen", "true");
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to 16th Military Circle</DialogTitle>
          <DialogDescription>
            Stay informed with the latest news, announcements, and resources from our unit.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button onClick={() => setOpen(false)}>Get Started</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default GreetingPopup;