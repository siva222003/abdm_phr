import {
  BadgeCheck,
  Bell,
  Building2,
  ChevronsUpDown,
  FileText,
  Home,
  LogOut,
  UserRound,
  Vault,
} from "lucide-react";
import { ActiveLink, navigate, useLocationChange } from "raviger";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

import { Avatar } from "@/components/common/Avatar";

import { useAuthContext } from "@/hooks/useAuth";

import { getProfilePhotoUrl } from "@/utils";

const items = [
  {
    title: "My Records",
    url: "/my-records",
    icon: <Home />,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: <UserRound />,
  },
  {
    title: "Consents",
    url: "/consents",
    icon: <FileText />,
  },
  {
    title: "Linked Facilities",
    url: "/linked-facilities",
    icon: <Building2 />,
  },
  {
    title: "Health Lockers",
    url: "/health-lockers",
    icon: <Vault />,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: <Bell />,
  },
];

export function AppSidebar() {
  const { logout, user } = useAuthContext();
  const { isMobile, setOpenMobile, open } = useSidebar();

  useLocationChange(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  });

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
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar
                    className="size-8 rounded-lg"
                    name={user?.fullName ?? ""}
                    imageUrl={getProfilePhotoUrl(user?.profilePhoto ?? null)}
                  />
                  {(open || isMobile) && (
                    <>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user?.fullName}
                        </span>
                        <span className="truncate text-xs">
                          {user?.abhaAddress}
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-auto size-4" />
                    </>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar
                      className="size-8 rounded-lg"
                      name={user?.fullName ?? ""}
                      imageUrl={getProfilePhotoUrl(user?.profilePhoto ?? null)}
                    />
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.fullName}
                      </span>
                      <span className="truncate text-xs">
                        {user?.abhaAddress}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    data-cy="user-menu-profile"
                    onClick={() => navigate("/profile")}
                  >
                    <BadgeCheck />
                    Profile
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  data-cy="user-menu-logout"
                  onClick={() => logout()}
                >
                  <LogOut />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail className="hover:after:bg-transparent hover:bg-transparent" />
    </Sidebar>
  );
}
