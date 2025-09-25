import React from "react";
import { Outlet } from "react-router-dom";

type DirectoryActions =
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

type DirectoryActionContextType = {
  directoryAction: DirectoryActions | null;
  setDirectoryAction: (action: DirectoryActions | null) => void;
};

const DirectoryActionContext = React.createContext<DirectoryActionContextType>({
  directoryAction: null,
  setDirectoryAction: () => {},
});

export const useDirectoryAction = () =>
  React.useContext(DirectoryActionContext);

export const DirectoryActionProvider: React.FC = () => {
  const [directoryAction, setDirectoryAction] =
    React.useState<DirectoryActions | null>(null);

  return (
    <DirectoryActionContext.Provider
      value={{ directoryAction, setDirectoryAction }}
    >
      <Outlet />
    </DirectoryActionContext.Provider>
  );
};

export const isCreateDirectoryAction = (
  action: DirectoryActions | null,
): action is { type: "create" } => action?.type === "create";

export const isUpdateDirectoryAction = (
  action: DirectoryActions | null,
): action is { type: "update"; id: string } => action?.type === "update";

export const isDeleteDirectoryAction = (
  action: DirectoryActions | null,
): action is { type: "delete"; id: string } => action?.type === "delete";
