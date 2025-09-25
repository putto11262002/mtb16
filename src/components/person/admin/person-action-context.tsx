import React from "react";
import { Outlet } from "react-router-dom";

type PersonActions =
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

type PersonActionContextType = {
  personAction: PersonActions | null;
  setPersonAction: (action: PersonActions | null) => void;
};

const PersonActionContext = React.createContext<PersonActionContextType>({
  personAction: null,
  setPersonAction: () => {},
});

export const usePersonAction = () => React.useContext(PersonActionContext);

export const PersonActionProvider: React.FC = () => {
  const [personAction, setPersonAction] = React.useState<PersonActions | null>(
    null,
  );

  return (
    <PersonActionContext.Provider value={{ personAction, setPersonAction }}>
      <Outlet />
    </PersonActionContext.Provider>
  );
};

export const isCreatePersonAction = (
  action: PersonActions | null,
): action is { type: "create" } => action?.type === "create";

export const isUpdatePersonAction = (
  action: PersonActions | null,
): action is { type: "update"; id: string } => action?.type === "update";

export const isDeletePersonAction = (
  action: PersonActions | null,
): action is { type: "delete"; id: string } => action?.type === "delete";
