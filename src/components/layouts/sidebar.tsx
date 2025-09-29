import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { signOut } from "@/lib/auth/client";
import { navigate } from "astro:transitions/client";
import {
  ChevronUp,
  Folder,
  Newspaper,
  Settings,
  Speaker,
  User2,
  Users,
} from "lucide-react";
import React from "react";
import { Link, Outlet } from "react-router-dom";

const menuItems = [
  {
    groupLabel: "เนื้อหา",
    items: [
      {
        title: "ข่าวสารและกิจกรรม",
        url: "/admin/news",
        icon: Newspaper,
      },
      {
        title: "ข่าวประชาสัมพันธ์",
        url: "/admin/announcements",
        icon: Speaker,
      },
      {
        title: "ไดเรกทอรี",
        url: "/admin/directory",
        icon: Folder,
      },
      {
        title: "บุคลากร",
        url: "/admin/persons",
        icon: Users,
      },
    ],
  },

  {
    groupLabel: "ตั้งค่า",
    items: [
      {
        title: "การตั้งค่า",
        url: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

export const SidebarLayout = () => {
  const [signingOut, setSigningOut] = React.useState(false);
  const signout = () =>
    signOut({
      fetchOptions: {
        onRequest: () => setSigningOut(true),
        onSuccess: () => {
          setSigningOut(false);
          navigate("/signin");
        },
      },
    });
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <Sidebar>
        <SidebarHeader className="text-lg font-bold py-3">
          <h1 className="px-3">ระบบจัดการข้อมูล</h1>
        </SidebarHeader>
        <SidebarContent>
          {menuItems.map((group) => (
            <SidebarGroup key={group.groupLabel}>
              <SidebarGroupLabel>{group.groupLabel}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link to={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 />
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  align="end"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem onClick={signout} disabled={signingOut}>
                    <span>ออกจากระบบ</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <div className="flex min-h-screen w-full flex-col overflow-x-hidden">
        <div className="sticky top-0 z-10 flex h-(--header-height) w-full items-center border-b bg-background px-4 shadow-sm">
          <SidebarTrigger />
        </div>
        <main className="m-t-( --header-height ) flex-1 w-full p-6">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};
