
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext, LogEntry } from "@/contexts/AppContext";
import { format, subDays, differenceInDays } from "date-fns";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Analytics = () => {
  const { categories, logs } = useAppContext();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    categories.length > 0 ? categories[0].id : null
  );
  const [selectedItemId, setSelectedItemId] = useState<string | null>(
    selectedCategoryId && categories.find(c => c.id === selectedCategoryId)?.items.length > 0
      ? categories.find(c => c.id === selectedCategoryId)?.items[0].id || null
      : null
  );
  const [timeRange, setTimeRange] = useState<"7days" | "30days" | "90days">("7days");

  // Get the selected category and item
  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const selectedItem = selectedCategory?.items.find(i => i.id === selectedItemId);

  // Filter logs by selected category and item
  const filteredLogs = logs.filter(
    log => log.categoryId === selectedCategoryId && log.itemId === selectedItemId
  );

  // Prepare chart data based on time range
  const getChartData = () => {
    if (!filteredLogs.length) return [];

    // Determine date range
    const today = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case "30days":
        startDate = subDays(today, 30);
        break;
      case "90days":
        startDate = subDays(today, 90);
        break;
      case "7days":
      default:
        startDate = subDays(today, 7);
        break;
    }

    // Filter logs by date range
    const dateFilteredLogs = filteredLogs.filter(
      log => new Date(log.timestamp) >= startDate
    );

    // Group logs by day
    const logsByDay = dateFilteredLogs.reduce<Record<string, LogEntry[]>>(
      (acc, log) => {
        const day = format(new Date(log.timestamp), "yyyy-MM-dd");
        if (!acc[day]) {
          acc[day] = [];
        }
        acc[day].push(log);
        return acc;
      },
      {}
    );

    // Generate a complete date range
    const daysCount = differenceInDays(today, startDate) + 1;
    const dateRange = Array.from({ length: daysCount }, (_, i) => {
      const date = subDays(today, daysCount - 1 - i);
      return format(date, "yyyy-MM-dd");
    });

    // Create chart data with averages for each day
    return dateRange.map(day => {
      const dayLogs = logsByDay[day] || [];
      const total = dayLogs.reduce((sum, log) => {
        const value = parseFloat(log.value.toString());
        return isNaN(value) ? sum : sum + value;
      }, 0);
      const average = dayLogs.length ? total / dayLogs.length : 0;

      return {
        date: format(new Date(day), "MMM d"),
        value: Math.round(average * 100) / 100,
        count: dayLogs.length,
      };
    });
  };

  const chartData = getChartData();

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value);
    const category = categories.find(c => c.id === value);
    if (category && category.items.length > 0) {
      setSelectedItemId(category.items[0].id);
    } else {
      setSelectedItemId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Visualize your tracking data over time</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Select what data to analyze</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select 
                value={selectedCategoryId || ""}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Item</label>
              <Select 
                value={selectedItemId || ""}
                onValueChange={setSelectedItemId}
                disabled={!selectedCategory || selectedCategory.items.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select item" />
                </SelectTrigger>
                <SelectContent>
                  {selectedCategory?.items.map(item => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Time Range</label>
              <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>
              {selectedCategory?.name} - {selectedItem?.name}
              {selectedItem?.unit ? ` (${selectedItem.unit})` : ""}
            </CardTitle>
            <CardDescription>
              {chartData.length 
                ? `Showing data for the last ${timeRange === "7days" ? "7" : timeRange === "30days" ? "30" : "90"} days` 
                : "No data available for the selected filters"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedCategoryId || !selectedItemId ? (
              <div className="flex flex-col items-center justify-center h-80 text-center p-6">
                <p className="text-muted-foreground mb-2">
                  Please select a category and item to view analytics
                </p>
              </div>
            ) : chartData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-80 text-center p-6">
                <p className="text-muted-foreground mb-2">No data available</p>
                <p className="text-sm text-muted-foreground">
                  Try selecting a different time range or start logging data for this item
                </p>
              </div>
            ) : (
              <Tabs defaultValue="line">
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="line">Line Chart</TabsTrigger>
                    <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="line" className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }} 
                        tickMargin={10}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }} 
                        tickMargin={10}
                      />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'var(--card)', 
                          borderColor: 'var(--border)' 
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        name={selectedItem?.name}
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
                
                <TabsContent value="bar" className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }} 
                        tickMargin={10}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }} 
                        tickMargin={10}
                      />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'var(--card)', 
                          borderColor: 'var(--border)' 
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="value"
                        name={selectedItem?.name}
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      {filteredLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Log Entries</CardTitle>
            <CardDescription>
              Recent entries for {selectedCategory?.name} - {selectedItem?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Time</th>
                    <th className="px-4 py-2 text-right">Value</th>
                    <th className="px-4 py-2 text-left">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .slice(0, 10)
                    .map((log) => (
                      <tr key={log.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-2">
                          {format(new Date(log.timestamp), "MMM d, yyyy")}
                        </td>
                        <td className="px-4 py-2">
                          {format(new Date(log.timestamp), "h:mm a")}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {log.value} {selectedItem?.unit}
                        </td>
                        <td className="px-4 py-2">{log.note || "-"}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {filteredLogs.length > 10 && (
                <div className="text-center mt-4 text-sm text-muted-foreground">
                  Showing 10 of {filteredLogs.length} entries
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Analytics;
