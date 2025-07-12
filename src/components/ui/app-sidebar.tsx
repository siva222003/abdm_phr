import { Home, Inbox, Podcast } from "lucide-react";
import { ActiveLink } from "raviger";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import { useAuthContext } from "@/hooks/useAuth";

const items = [
  {
    title: "Home",
    url: "/hey",
    icon: <Home />,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: <Inbox />,
  },
  {
    title: "Consents",
    url: "/consents",
    icon: <Podcast />,
  },
];

export function AppSidebar() {
  const { logout } = useAuthContext();
  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      className="group-data-[side=left]:border-r-0"
    >
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className="text-gray-600 transition font-normal hover:bg-gray-200 hover:text-green-700"
                  >
                    <ActiveLink
                      href={item.url}
                      activeClass="bg-white text-green-700 shadow-sm"
                    >
                      {item.icon}

                      <span className="group-data-[collapsible=icon]:hidden ml-1">
                        {item.title}
                      </span>
                    </ActiveLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Logout"
                  className="text-gray-600 transition font-normal hover:bg-gray-200 hover:text-red-700"
                >
                  <button onClick={() => logout()}>Logout</button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail className="hover:after:bg-transparent hover:bg-transparent" />
    </Sidebar>
  );
}
