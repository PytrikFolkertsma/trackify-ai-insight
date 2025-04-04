
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, ArrowDown } from "lucide-react";
import { useAppContext, Category, TrackItem } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";

type ChatMessage = {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
};

type TrackingItem = {
  categoryId: string;
  itemId: string;
  value: string;
  note?: string;
};

const Logger = () => {
  const { categories, addLogEntry } = useAppContext();
  const { toast } = useToast();
  
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      text: "Hi there! What would you like to track today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [trackingItems, setTrackingItems] = useState<TrackingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Simulate AI response (in a real app, this would call an actual AI service)
    setTimeout(() => {
      processUserMessage(userMessage);
      setIsLoading(false);
    }, 1000);
  };

  const processUserMessage = (message: ChatMessage) => {
    const text = message.text.toLowerCase();
    
    // Check if user is trying to track something specific
    if (text.includes("track") || text.includes("log") || text.includes("record")) {
      const responseParts = [];
      let newTrackingItems: TrackingItem[] = [...trackingItems];
      let updatedSomething = false;
      
      // Very basic parsing logic - in a real app this would be more sophisticated
      // Try to match categories
      categories.forEach(category => {
        if (text.includes(category.name.toLowerCase())) {
          // Check for items in this category
          category.items.forEach(item => {
            if (text.includes(item.name.toLowerCase())) {
              // Try to extract a number
              const matches = text.match(/\d+(\.\d+)?/);
              if (matches && matches[0]) {
                const value = matches[0];
                
                // Check if we're updating an existing item or adding a new one
                const existingIndex = newTrackingItems.findIndex(
                  ti => ti.categoryId === category.id && ti.itemId === item.id
                );
                
                if (existingIndex >= 0) {
                  newTrackingItems[existingIndex].value = value;
                } else {
                  newTrackingItems.push({
                    categoryId: category.id,
                    itemId: item.id,
                    value: value,
                  });
                }
                
                responseParts.push(`I'll track ${item.name} as ${value}${item.unit ? ` ${item.unit}` : ''} in ${category.name}.`);
                updatedSomething = true;
              }
            }
          });
        }
      });
      
      setTrackingItems(newTrackingItems);
      
      if (!updatedSomething) {
        const availableCategories = categories.map(c => c.name).join(", ");
        setMessages(prev => [
          ...prev, 
          {
            id: Date.now().toString(),
            text: `I'm not sure what you want to track. You can track items from these categories: ${availableCategories}. Can you be more specific?`,
            sender: "assistant",
            timestamp: new Date(),
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev, 
          {
            id: Date.now().toString(),
            text: responseParts.join(" ") + " Anything else you'd like to track?",
            sender: "assistant",
            timestamp: new Date(),
          }
        ]);
      }
    } 
    // If asking for help or general questions
    else if (text.includes("help") || text.includes("how") || text.includes("?")) {
      setMessages(prev => [
        ...prev, 
        {
          id: Date.now().toString(),
          text: "To track something, try saying something like 'Track 2000 calories in Nutrition' or 'Log 8000 steps in Fitness'. You can see all available categories and items in the Categories section.",
          sender: "assistant",
          timestamp: new Date(),
        }
      ]);
    } 
    // Default response
    else {
      setMessages(prev => [
        ...prev, 
        {
          id: Date.now().toString(),
          text: "What would you like to track today? You can tell me something like 'Track 60kg weight in Fitness'.",
          sender: "assistant",
          timestamp: new Date(),
        }
      ]);
    }
  };

  const handleLogEntries = () => {
    if (trackingItems.length === 0) {
      toast({
        title: "Nothing to log",
        description: "Please add some items to track before logging.",
        variant: "destructive",
      });
      return;
    }

    // Log each item
    trackingItems.forEach(item => {
      addLogEntry(item.categoryId, item.itemId, item.value, item.note);
    });

    // Clear tracking items
    setTrackingItems([]);

    // Show success message
    toast({
      title: "Entries logged successfully",
      description: `Logged ${trackingItems.length} ${trackingItems.length === 1 ? 'item' : 'items'}.`,
    });

    // Add confirmation message to chat
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        text: `Great! I've logged ${trackingItems.length} ${trackingItems.length === 1 ? 'item' : 'items'} for you. What else would you like to track?`,
        sender: "assistant",
        timestamp: new Date(),
      },
    ]);
  };

  const getCategoryAndItem = (categoryId: string, itemId: string) => {
    const category = categories.find(c => c.id === categoryId);
    const item = category?.items.find(i => i.id === itemId);
    return { category, item };
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Logger</h1>
        <p className="text-muted-foreground">Track your progress with natural language</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        <Card className="p-4 md:col-span-2 flex flex-col h-[60vh]">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[80%] ${
                    message.sender === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`rounded-full p-2 flex items-center justify-center ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground ml-2"
                        : "bg-accent text-accent-foreground mr-2"
                    }`}
                  >
                    {message.sender === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent"
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex">
                  <div className="rounded-full p-2 bg-accent mr-2 flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-accent rounded-lg px-4 py-2">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse" />
                      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-150" />
                      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-300" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
            
            {messages.length > 4 && (
              <Button 
                variant="outline" 
                size="icon" 
                className="fixed bottom-24 right-8 rounded-full opacity-80 hover:opacity-100"
                onClick={scrollToBottom}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              disabled={isLoading}
            />
            <Button onClick={handleSendMessage} disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        <Card className="p-4 flex flex-col h-[60vh]">
          <h2 className="font-semibold mb-4">Tracking Items</h2>
          <div className="flex-1 overflow-y-auto mb-4">
            {trackingItems.length === 0 ? (
              <div className="text-center p-6 text-muted-foreground">
                <p>No items to track yet.</p>
                <p className="text-sm mt-2">
                  Tell the assistant what you'd like to track.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {trackingItems.map((trackingItem, index) => {
                  const { category, item } = getCategoryAndItem(
                    trackingItem.categoryId, 
                    trackingItem.itemId
                  );
                  
                  return (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium">{category?.name}</p>
                          <p className="font-semibold">
                            {item?.name}: {trackingItem.value}
                            {item?.unit ? ` ${item.unit}` : ''}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            setTrackingItems(trackingItems.filter((_, i) => i !== index));
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {trackingItem.note && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {trackingItem.note}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <Button 
            className="w-full" 
            onClick={handleLogEntries}
            disabled={trackingItems.length === 0}
          >
            Log Entries
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Logger;

// Import for Trash2 icon
import { Trash2 } from "lucide-react";
