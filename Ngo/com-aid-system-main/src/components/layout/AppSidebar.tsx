import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  MapPin,
  Users,
  Heart,
  BarChart3,
  MessageSquare,
  Settings,
  Shield,
  AlertCircle,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/dashboard",
    badge: null,
  },
  {
    title: "Live Requests",
    icon: MapPin,
    url: "/dashboard/requests",
    badge: "5",
    badgeVariant: "danger" as const,
  },
  {
    title: "Resources",
    icon: Package,
    url: "/dashboard/resources",
    badge: null,
  },
  {
    title: "Volunteers",
    icon: Users,
    url: "/dashboard/volunteers",
    badge: "12",
    badgeVariant: "success" as const,
  },
  {
    title: "Donations",
    icon: Heart,
    url: "/dashboard/donations",
    badge: null,
  },
  {
    title: "Analytics",
    icon: BarChart3,
    url: "/dashboard/analytics",
    badge: null,
  },
  {
    title: "Communication",
    icon: MessageSquare,
    url: "/dashboard/communication",
    badge: "3",
    badgeVariant: "info" as const,
  },
];

const settingsItems = [
  {
    title: "NGO Profile",
    icon: Shield,
    url: "/dashboard/profile",
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/dashboard/settings",
  },
  {
    title: "Emergency Alert",
    icon: AlertCircle,
    url: "/dashboard/emergency",
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* Logo Section */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-bold text-foreground">Relief NGO</h2>
                <p className="text-xs text-muted-foreground">Disaster Management</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "hover:bg-sidebar-accent/50"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <Badge
                              variant={item.badgeVariant || "default"}
                              className="h-5 px-1.5 text-xs"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "hover:bg-sidebar-accent/50"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Status Card */}
        {!isCollapsed && (
          <div className="mt-auto p-4">
            <div className="rounded-lg bg-gradient-success p-4 text-white">
              <h3 className="font-semibold">System Status</h3>
              <p className="text-sm opacity-90 mt-1">All services operational</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                <span className="text-xs">Live</span>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}