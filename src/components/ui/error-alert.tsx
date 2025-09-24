import { CircleX } from "lucide-react";
import type { PropsWithChildren } from "react";
import { Alert, AlertTitle } from "./alert";

export const ErrorAlert: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Alert variant="destructive">
      <CircleX className="h-4 w-4 text-destructive" />
      <AlertTitle>{children}</AlertTitle>
    </Alert>
  );
};
