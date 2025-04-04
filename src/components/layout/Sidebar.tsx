
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  BarChart3, 
  ChevronLeft, 
  ChevronRight, 
  Gauge, 
  ListTodo, 
  MessageSquare, 
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside 
      className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        {!collapsed && (
          <h1 className="text-lg font-bold text-sidebar-foreground">Trackify</h1>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent ml-auto"
          onClick={toggleSidebar}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>
      
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          <NavItem 
            to="/" 
            icon={<Gauge size={20} />} 
            text="Dashboard" 
            collapsed={collapsed} 
          />
          <NavItem 
            to="/categories" 
            icon={<ListTodo size={20} />} 
            text="Categories" 
            collapsed={collapsed} 
          />
          <NavItem 
            to="/logger" 
            icon={<MessageSquare size={20} />} 
            text="Logger" 
            collapsed={collapsed} 
          />
          <NavItem 
            to="/analytics" 
            icon={<BarChart3 size={20} />} 
            text="Analytics" 
            collapsed={collapsed} 
          />
          <NavItem 
            to="/feedback" 
            icon={<Settings size={20} />} 
            text="Feedback" 
            collapsed={collapsed} 
          />
        </ul>
      </nav>
    </aside>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  collapsed: boolean;
}

const NavItem = ({ to, icon, text, collapsed }: NavItemProps) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          cn(
            "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
            isActive
              ? "bg-sidebar-primary text-sidebar-primary-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed ? "justify-center" : ""
          )
        }
      >
        {icon}
        {!collapsed && <span className="ml-3">{text}</span>}
      </NavLink>
    </li>
  );
};
