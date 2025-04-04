
import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "../ThemeToggle";

export const AppLayout = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center justify-end px-6 border-b">
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
