import { CircleCheck } from "lucide-react";
import { Alert, AlertTitle } from "./alert";

export const SuccessAlert = (message: string) => {
  return (
    <Alert variant="destructive">
      <CircleCheck className="h-4 w-4 text-destructive" />
      <AlertTitle>{message} </AlertTitle>
    </Alert>
  );
};
