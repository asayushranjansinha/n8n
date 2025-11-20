"use client";

import { authClient } from "@/lib/auth-client";
import {
  CreditCardIcon,
  FolderOpenIcon,
  HistoryIcon,
  KeyIcon,
  LogOutIcon,
  StarIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Main",
    items: [
      {
        title: "Workflows",
        icon: FolderOpenIcon,
        url: "/workflows",
      },
      {
        title: "Credentials",
        icon: KeyIcon,
        url: "/credentials",
      },
      {
        title: "Executions",
        icon: HistoryIcon,
        url: "/executions",
      },
    ],
  },
];

export const AppSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const footerItems = useMemo(() => {
    return [
      {
        title: "Footer",
        items: [
          {
            title: "Upgrade to Pro",
            icon: StarIcon,
            onClick: () => {},
          },
          {
            title: "Billing portal",
            icon: CreditCardIcon,
            onClick: () => {},
          },
          {
            title: "Logout",
            icon: LogOutIcon,
            onClick: async () => {
              // Show toast
              const toastId = toast.loading("Logging Out");
              await authClient.signOut({
                fetchOptions: {
                  onRequest: () => {
                    // Already handled by loading toast
                  },
                  onSuccess: () => {
                    toast.success("Logged Out successfully!", {
                      id: toastId, // replaces the loading toast
                    });
                    router.replace("/login");
                  },
                  onError: (ctx) => {
                    toast.error(ctx.error.message || "Something went wrong", {
                      id: toastId, // replaces the loading toast
                    });
                  },
                },
              });
            },
          },
        ],
      },
    ];
  }, []);
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                prefetch
                href="/"
                className="flex self-center items-center gap-2 text-2xl font-semibold"
              >
                <Image
                  src="/logo.svg"
                  alt="N8N"
                  width={28}
                  height={28}
                  className="size-[28px]"
                />
                N8N
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={
                        item.url === "/"
                          ? pathname === "/"
                          : pathname.startsWith(item.url)
                      }
                    >
                      <Link href={item.url} prefetch>
                        <item.icon className="size-4" />
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

      {/* Footer actions */}
      <SidebarFooter>
        {footerItems.map((group) => (
          <SidebarMenu key={group.title}>
            {group.items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} onClick={item.onClick}>
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        ))}
      </SidebarFooter>
    </Sidebar>
  );
};
