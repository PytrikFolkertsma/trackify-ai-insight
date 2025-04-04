
import React, { createContext, useContext, useState } from "react";

// Mock data types
export type TrackItem = {
  id: string;
  name: string;
  enabled: boolean;
  unit?: string; // optional unit for the trackable item
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  name: string;
  items: TrackItem[];
  createdAt: string;
  updatedAt: string;
};

export type LogEntry = {
  id: string;
  categoryId: string;
  itemId: string;
  value: number | string;
  timestamp: string;
  note?: string;
};

interface AppContextType {
  categories: Category[];
  logs: LogEntry[];
  addCategory: (name: string) => void;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  addTrackItem: (categoryId: string, name: string, unit?: string) => void;
  updateTrackItem: (categoryId: string, itemId: string, updates: Partial<TrackItem>) => void;
  deleteTrackItem: (categoryId: string, itemId: string) => void;
  toggleTrackItem: (categoryId: string, itemId: string) => void;
  addLogEntry: (categoryId: string, itemId: string, value: number | string, note?: string) => void;
}

// Mock data
const initialCategories: Category[] = [
  {
    id: "1",
    name: "Fitness",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
      {
        id: "101",
        name: "Steps",
        enabled: true,
        unit: "steps",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "102",
        name: "Weight",
        enabled: true,
        unit: "kg",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ]
  },
  {
    id: "2",
    name: "Nutrition",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
      {
        id: "201",
        name: "Calories",
        enabled: true,
        unit: "kcal",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "202",
        name: "Protein",
        enabled: true,
        unit: "g",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "203",
        name: "Carbs",
        enabled: true,
        unit: "g",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ]
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addCategory = (name: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (id: string, name: string) => {
    setCategories(
      categories.map(category =>
        category.id === id
          ? { ...category, name, updatedAt: new Date().toISOString() }
          : category
      )
    );
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(category => category.id !== id));
  };

  const addTrackItem = (categoryId: string, name: string, unit?: string) => {
    const newItem: TrackItem = {
      id: Date.now().toString(),
      name,
      enabled: true,
      unit,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCategories(
      categories.map(category =>
        category.id === categoryId
          ? { ...category, items: [...category.items, newItem], updatedAt: new Date().toISOString() }
          : category
      )
    );
  };

  const updateTrackItem = (categoryId: string, itemId: string, updates: Partial<TrackItem>) => {
    setCategories(
      categories.map(category =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.map(item =>
                item.id === itemId
                  ? { ...item, ...updates, updatedAt: new Date().toISOString() }
                  : item
              ),
              updatedAt: new Date().toISOString(),
            }
          : category
      )
    );
  };

  const deleteTrackItem = (categoryId: string, itemId: string) => {
    setCategories(
      categories.map(category =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.filter(item => item.id !== itemId),
              updatedAt: new Date().toISOString(),
            }
          : category
      )
    );
  };

  const toggleTrackItem = (categoryId: string, itemId: string) => {
    setCategories(
      categories.map(category =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.map(item =>
                item.id === itemId
                  ? { ...item, enabled: !item.enabled, updatedAt: new Date().toISOString() }
                  : item
              ),
              updatedAt: new Date().toISOString(),
            }
          : category
      )
    );
  };

  const addLogEntry = (categoryId: string, itemId: string, value: number | string, note?: string) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      categoryId,
      itemId,
      value,
      timestamp: new Date().toISOString(),
      note,
    };
    setLogs([...logs, newLog]);
  };

  return (
    <AppContext.Provider
      value={{
        categories,
        logs,
        addCategory,
        updateCategory,
        deleteCategory,
        addTrackItem,
        updateTrackItem,
        deleteTrackItem,
        toggleTrackItem,
        addLogEntry,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
