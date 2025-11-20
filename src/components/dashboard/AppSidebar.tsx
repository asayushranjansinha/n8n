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
import { useHasActiveSubscription } from "@/features/subscriptions/hooks/useSubscription";

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
type FooterItem = {
    title: string;
    icon: any;
    onClick: () => void | Promise<void>;
  };
  
export const AppSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const {hasActiveSubscription, isLoading} = useHasActiveSubscription()

  const footerItems = useMemo(() => {
    const items: FooterItem[] = [];
  
    // Only add upgrade item when conditions match
    if (!isLoading && !hasActiveSubscription) {
      items.push({
        title: "Upgrade to Pro",
        icon: StarIcon,
        onClick: async () => {
          await authClient.checkout({
            slug: "pro",
          });
        },
      });
    }
  
    // Billing Portal
    items.push({
      title: "Billing portal",
      icon: CreditCardIcon,
      onClick: () => {},
    });
  
    // Logout
    items.push({
      title: "Logout",
      icon: LogOutIcon,
      onClick: async () => {
        const toastId = toast.loading("Logging Out");
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              toast.success("Logged Out successfully!", { id: toastId });
              router.replace("/login");
            },
            onError: (ctx) => {
              toast.error(ctx.error.message || "Something went wrong", {
                id: toastId,
              });
            },
          },
        });
      },
    });
  
    return [
      {
        title: "Footer",
        items,
      },
    ];
  }, [isLoading, hasActiveSubscription]);
  
  

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
