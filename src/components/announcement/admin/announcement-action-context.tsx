import React from "react";
import { Outlet } from "react-router-dom";

type AnnouncementActions =
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
    }
  | { type: "publish"; id: string }
  | { type: "unpublish"; id: string };

type AnnouncementActionContextType = {
  announcementAction: AnnouncementActions | null;
  setAnnouncementAction: (action: AnnouncementActions | null) => void;
};

const AnnouncementActionContext =
  React.createContext<AnnouncementActionContextType>({
    announcementAction: null,
    setAnnouncementAction: () => {},
  });

export const useAnnouncementAction = () =>
  React.useContext(AnnouncementActionContext);

export const AnnouncementActionProvider: React.FC = () => {
  const [announcementAction, setAnnouncementAction] =
    React.useState<AnnouncementActions | null>(null);

  return (
    <AnnouncementActionContext.Provider
      value={{ announcementAction, setAnnouncementAction }}
    >
      <Outlet />
    </AnnouncementActionContext.Provider>
  );
};

export const isCreateAnnouncementAction = (
  action: AnnouncementActions | null,
): action is { type: "create" } => action?.type === "create";

export const isUpdateAnnouncementAction = (
  action: AnnouncementActions | null,
): action is { type: "update"; id: string } => action?.type === "update";

export const isDeleteAnnouncementAction = (
  action: AnnouncementActions | null,
): action is { type: "delete"; id: string } => action?.type === "delete";

export const isPublishAnnouncementAction = (
  action: AnnouncementActions | null,
): action is { type: "publish"; id: string } => action?.type === "publish";

export const isUnpublishAnnouncementAction = (
  action: AnnouncementActions | null,
): action is { type: "unpublish"; id: string } => action?.type === "unpublish";
