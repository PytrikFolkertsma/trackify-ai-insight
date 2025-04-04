
import React from "react";
import { NavLink } from "react-router-dom";
import { 
  BarChart3,
  Gauge, 
  ListTodo, 
  MessageSquare, 
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter
} from "@/components/ui/sidebar";

export const Sidebar = () => {
  return (
    <SidebarComponent collapsible="offcanvas" variant="sidebar">
      <SidebarHeader>
        <div className="p-2">
          <h2 className="text-lg font-bold text-sidebar-foreground">Trackify</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <NavItem to="/" icon={<Gauge size={20} />} text="Dashboard" />
          <NavItem to="/categories" icon={<ListTodo size={20} />} text="Categories" />
          <NavItem to="/logger" icon={<MessageSquare size={20} />} text="Logger" />
          <NavItem to="/analytics" icon={<BarChart3 size={20} />} text="Analytics" />
          <NavItem to="/feedback" icon={<Settings size={20} />} text="Feedback" />
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2 text-xs text-sidebar-foreground/60">
          © {new Date().getFullYear()} Trackify
        </div>
      </SidebarFooter>
    </SidebarComponent>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
}

const NavItem = ({ to, icon, text }: NavItemProps) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={text}>
        <NavLink
          to={to}
          className={({ isActive }) =>
            cn(
              isActive
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )
          }
        >
          {icon}
          <span>{text}</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
