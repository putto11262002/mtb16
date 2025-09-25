import React from "react";
import { Outlet } from "react-router-dom";

type NewsActions =
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

type NewsActionContextType = {
  newsAction: NewsActions | null;
  setNewsAction: (action: NewsActions | null) => void;
};

const NewsActionContext = React.createContext<NewsActionContextType>({
  newsAction: null,
  setNewsAction: () => {},
});

export const useNewsAction = () => React.useContext(NewsActionContext);

export const NewsActionProvider: React.FC = () => {
  const [newsAction, setNewsAction] = React.useState<NewsActions | null>(null);

  return (
    <NewsActionContext.Provider value={{ newsAction, setNewsAction }}>
      <Outlet />
    </NewsActionContext.Provider>
  );
};

export const isCreateNewsAction = (
  action: NewsActions | null,
): action is { type: "create" } => action?.type === "create";

export const isUpdateNewsAction = (
  action: NewsActions | null,
): action is { type: "update"; id: string } => action?.type === "update";

export const isDeleteNewsAction = (
  action: NewsActions | null,
): action is { type: "delete"; id: string } => action?.type === "delete";

export const isPublishNewsAction = (
  action: NewsActions | null,
): action is { type: "publish"; id: string } => action?.type === "publish";

export const isUnpublishNewsAction = (
  action: NewsActions | null,
): action is { type: "unpublish"; id: string } => action?.type === "unpublish";
