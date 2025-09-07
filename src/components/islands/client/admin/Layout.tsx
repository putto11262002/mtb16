import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import type { FC } from "react";
import {
  Newspaper,
  File,
  Speaker,
  TableOfContents,
  Sticker,
  User2,
  ChevronUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "better-auth";
import { signOut } from "@/lib/auth/client";
import React from "react";
import { navigate } from "astro:transitions/client";

const menuItems = [
  {
    groupLabel: "คอลเลกชัน",
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
        title: "ไฟล์ดาวน์โหลด",
        url: "/admin/downloads",
        icon: File,
      },
    ],
  },
  {
    groupLabel: "เนื้อหา",
    items: [
      {
        title: "ป๊อปอัปหน้าแรก",
        url: "/admin/popups",
        icon: Sticker,
      },
      {
        title: "เนื้อหาข้อความ",
        url: "/admin/copies",
        icon: TableOfContents,
      },
    ],
  },
];

export const SidebarLayout: FC<{ children: React.ReactNode; user: User }> = ({
  user,
  children,
}) => {
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
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
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
                    <User2 /> {user.name}
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
      <main className="flex min-h-screen w-full flex-col">
        <div className="sticky top-0 z-10 flex h-(--header-height) w-full items-center border-b bg-background px-4 shadow-sm">
          <SidebarTrigger />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
};
