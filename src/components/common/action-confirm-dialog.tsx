import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

export const ActionConfirmDialog = ({
  onConfirm,
  Title,
  Description,
  onOpenChange,
  open,
  isPending,
}: {
  onConfirm: () => void;
  Title: string;
  Description: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  isPending: boolean;
}) => {
  return (
    <AlertDialog open={open && !isPending} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{Title}</AlertDialogTitle>
          <AlertDialogDescription>{Description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isPending}>
            Confirm
            {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
