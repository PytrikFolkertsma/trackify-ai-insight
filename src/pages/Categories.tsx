
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Search, Plus, Trash2, Edit, Check, X } from "lucide-react";
import { useAppContext, Category, TrackItem } from "@/contexts/AppContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const Categories = () => {
  const { 
    categories, 
    addCategory, 
    updateCategory, 
    deleteCategory,
    addTrackItem,
    updateTrackItem,
    deleteTrackItem,
    toggleTrackItem
  } = useAppContext();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setNewCategoryName("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground">Manage your trackable categories and items</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search categories..."
            className="w-full sm:w-[300px] pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="flex items-center space-x-2">
            <Switch 
              id="show-archived" 
              checked={showArchived}
              onCheckedChange={setShowArchived}
            />
            <Label htmlFor="show-archived">Show disabled items</Label>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleAddCategory}>Add Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCategories.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center h-40 text-center">
            <p className="text-muted-foreground mb-2">No categories found</p>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "Try a different search term" : "Create a category to get started"}
            </p>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <CategoryCard 
              key={category.id} 
              category={category}
              updateCategory={updateCategory}
              deleteCategory={deleteCategory}
              addTrackItem={addTrackItem}
              updateTrackItem={updateTrackItem}
              deleteTrackItem={deleteTrackItem}
              toggleTrackItem={toggleTrackItem}
              showArchived={showArchived}
            />
          ))
        )}
      </div>
    </div>
  );
};

interface CategoryCardProps {
  category: Category;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  addTrackItem: (categoryId: string, name: string, unit?: string) => void;
  updateTrackItem: (categoryId: string, itemId: string, updates: Partial<TrackItem>) => void;
  deleteTrackItem: (categoryId: string, itemId: string) => void;
  toggleTrackItem: (categoryId: string, itemId: string) => void;
  showArchived: boolean;
}

const CategoryCard = ({ 
  category, 
  updateCategory, 
  deleteCategory,
  addTrackItem,
  updateTrackItem,
  deleteTrackItem,
  toggleTrackItem,
  showArchived
}: CategoryCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(category.name);
  const [newItemName, setNewItemName] = useState("");
  const [newItemUnit, setNewItemUnit] = useState("");

  const handleUpdate = () => {
    if (editName.trim()) {
      updateCategory(category.id, editName.trim());
      setIsEditing(false);
    }
  };

  const handleAddItem = () => {
    if (newItemName.trim()) {
      addTrackItem(category.id, newItemName.trim(), newItemUnit.trim() || undefined);
      setNewItemName("");
      setNewItemUnit("");
    }
  };

  // Filter items based on showArchived setting
  const displayItems = showArchived 
    ? category.items 
    : category.items.filter(item => item.enabled);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-secondary/50">
        <div className="flex items-center justify-between">
          {isEditing ? (
            <div className="flex-1 flex items-center space-x-2">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-lg font-bold"
              />
              <Button size="icon" variant="ghost" onClick={handleUpdate}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => {
                setIsEditing(false);
                setEditName(category.name);
              }}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <CardTitle>{category.name}</CardTitle>
              <div className="flex items-center space-x-1">
                <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you sure?</DialogTitle>
                    </DialogHeader>
                    <p className="py-4">
                      This will delete the "{category.name}" category and all its items.
                      This action cannot be undone.
                    </p>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button 
                          variant="destructive" 
                          onClick={() => deleteCategory(category.id)}
                        >
                          Delete
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </>
          )}
        </div>
        <CardDescription>
          {displayItems.length} {displayItems.length === 1 ? 'item' : 'items'}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {displayItems.map((item) => (
            <TrackItemRow
              key={item.id}
              item={item}
              categoryId={category.id}
              updateTrackItem={updateTrackItem}
              deleteTrackItem={deleteTrackItem}
              toggleTrackItem={toggleTrackItem}
            />
          ))}
        </div>
        <div className="p-4 bg-background/50 grid grid-cols-1 sm:grid-cols-5 gap-2">
          <Input
            placeholder="New item name"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="sm:col-span-2"
          />
          <Input
            placeholder="Unit (optional)"
            value={newItemUnit}
            onChange={(e) => setNewItemUnit(e.target.value)}
            className="sm:col-span-2"
          />
          <Button onClick={handleAddItem} className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface TrackItemRowProps {
  item: TrackItem;
  categoryId: string;
  updateTrackItem: (categoryId: string, itemId: string, updates: Partial<TrackItem>) => void;
  deleteTrackItem: (categoryId: string, itemId: string) => void;
  toggleTrackItem: (categoryId: string, itemId: string) => void;
}

const TrackItemRow = ({ 
  item, 
  categoryId, 
  updateTrackItem, 
  deleteTrackItem, 
  toggleTrackItem 
}: TrackItemRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editUnit, setEditUnit] = useState(item.unit || "");

  const handleUpdate = () => {
    if (editName.trim()) {
      updateTrackItem(categoryId, item.id, {
        name: editName.trim(),
        unit: editUnit.trim() || undefined
      });
      setIsEditing(false);
    }
  };

  return (
    <div className={`p-4 flex items-center justify-between ${!item.enabled ? 'opacity-60' : ''}`}>
      {isEditing ? (
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-5 gap-2">
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="sm:col-span-2"
          />
          <Input
            value={editUnit}
            onChange={(e) => setEditUnit(e.target.value)}
            placeholder="Unit (optional)"
            className="sm:col-span-2"
          />
          <div className="flex space-x-1">
            <Button size="sm" variant="ghost" onClick={handleUpdate}>
              <Check className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => {
              setIsEditing(false);
              setEditName(item.name);
              setEditUnit(item.unit || "");
            }}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center space-x-2">
            <Switch
              checked={item.enabled}
              onCheckedChange={() => toggleTrackItem(categoryId, item.id)}
            />
            <span className="font-medium">{item.name}</span>
            {item.unit && (
              <span className="text-sm text-muted-foreground">({item.unit})</span>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                </DialogHeader>
                <p className="py-4">
                  This will delete the "{item.name}" item.
                  This action cannot be undone.
                </p>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button 
                      variant="destructive" 
                      onClick={() => deleteTrackItem(categoryId, item.id)}
                    >
                      Delete
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </>
      )}
    </div>
  );
};

export default Categories;
