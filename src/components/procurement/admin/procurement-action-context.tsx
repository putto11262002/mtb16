import React from "react";

type ProcurementActions =
  | {
      type: "create";
    }
  | {
      type: "update";
      id: string;
    }
  | {
      type: "delete";
      id: string;
    };

type ProcurementActionContextType = {
  procurementAction: ProcurementActions | null;
  setProcurementAction: (action: ProcurementActions | null) => void;
};

const ProcurementActionContext =
  React.createContext<ProcurementActionContextType>({
    procurementAction: null,
    setProcurementAction: () => {},
  });

export const useProcurementAction = () =>
  React.useContext(ProcurementActionContext);

export const ProcurementActionProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [procurementAction, setProcurementAction] =
    React.useState<ProcurementActions | null>(null);

  return (
    <ProcurementActionContext.Provider
      value={{ procurementAction, setProcurementAction }}
    >
      {children}
    </ProcurementActionContext.Provider>
  );
};

export const isCreateProcurementAction = (
  action: ProcurementActions | null,
): action is { type: "create" } => action?.type === "create";

export const isUpdateProcurementAction = (
  action: ProcurementActions | null,
): action is { type: "update"; id: string } => action?.type === "update";

export const isDeleteProcurementAction = (
  action: ProcurementActions | null,
): action is { type: "delete"; id: string } => action?.type === "delete";
