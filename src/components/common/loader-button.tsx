import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

export const LoaderButton: React.FC<
  React.ComponentProps<typeof Button> & {
    isLoading: boolean;
    // If true, the button text will be hidden when loading
    inplace?: boolean;
  }
> = ({ inplace, isLoading, ...props }) => {
  return (
    <Button {...props} disabled={props.disabled || isLoading}>
      {inplace && isLoading ? null : props.children}
      {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
    </Button>
  );
};
