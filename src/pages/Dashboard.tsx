
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, BarChart3, Clock, ListTodo } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";

const Dashboard = () => {
  const { categories, logs } = useAppContext();

  const today = new Date().toLocaleDateString();
  const todayLogs = logs.filter(log => 
    new Date(log.timestamp).toLocaleDateString() === today
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Track your progress and view insights</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              Tracking across {categories.reduce((acc, cat) => acc + cat.items.length, 0)} items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Items</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.reduce((acc, cat) => acc + cat.items.filter(item => item.enabled).length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Out of {categories.reduce((acc, cat) => acc + cat.items.length, 0)} total items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Entries</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayLogs.length}</div>
            <p className="text-xs text-muted-foreground">
              {todayLogs.length > 0 ? "Last entry " + new Date(todayLogs[todayLogs.length - 1].timestamp).toLocaleTimeString() : "No entries today"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logs.length}</div>
            <p className="text-xs text-muted-foreground">
              Over {new Set(logs.map(log => new Date(log.timestamp).toLocaleDateString())).size} days
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent tracking activity</CardDescription>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <p className="text-muted-foreground mb-2">No logs yet</p>
                <p className="text-sm text-muted-foreground">
                  Start tracking to see your recent activity here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {logs.slice(-5).reverse().map(log => {
                  const category = categories.find(cat => cat.id === log.categoryId);
                  const item = category?.items.find(item => item.id === log.itemId);
                  
                  return (
                    <div key={log.id} className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Activity className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {category?.name} - {item?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {log.value} {item?.unit}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>A summary of your tracking categories</CardDescription>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <p className="text-muted-foreground mb-2">No categories yet</p>
                <p className="text-sm text-muted-foreground">
                  Create categories to start tracking your progress
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {categories.map(category => (
                  <div key={category.id}>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium">{category.name}</h4>
                      <span className="text-xs text-muted-foreground">
                        {category.items.filter(item => item.enabled).length}/{category.items.length} active
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ 
                          width: `${category.items.length > 0 
                            ? (category.items.filter(item => item.enabled).length / category.items.length) * 100
                            : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
