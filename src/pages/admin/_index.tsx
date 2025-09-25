import { AnnouncementActionProvider } from "@/components/announcement/admin/announcement-action-context";
import { SidebarLayout } from "@/components/layouts/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import AdminAnnouncementPage from "./announcements/_page";

const queryClient = new QueryClient();
// Entry point for the highly interactive admin React app
// - All routes are handled by React Router
export const AdminApp = () => {
  return (
    <>
      <BrowserRouter>
        <Toaster />
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route element={<SidebarLayout />}>
              <Route path="admin" element={<AnnouncementActionProvider />}>
                <Route
                  path="announcements"
                  element={<AdminAnnouncementPage />}
                />
              </Route>
            </Route>
          </Routes>
        </QueryClientProvider>
      </BrowserRouter>
    </>
  );
};
