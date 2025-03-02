
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Trash2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data - in a real app, this would come from a database
const mockSavedContent = [
  {
    id: "1",
    type: "ideas",
    title: "5 Eco-Friendly Living Tips",
    content: "1. Switch to reusable shopping bags\n2. Start composting at home\n3. Use energy-efficient appliances\n4. Reduce water waste\n5. Buy local produce",
    date: "2023-05-15"
  },
  {
    id: "2",
    type: "hooks",
    title: "Fitness Motivation Hooks",
    content: "• \"Transform your body in just 30 days with these simple exercises\"\n• \"The workout secret fitness influencers don't want you to know\"\n• \"How I lost 20 pounds without giving up my favorite foods\"",
    date: "2023-05-10"
  },
  {
    id: "3",
    type: "hashtags",
    title: "Tech Product Hashtags",
    content: "#TechTips #GadgetReview #TechNews #Innovation #NewTech #ProductLaunch #TechTutorial #SmartHome #TechLife #FutureTech",
    date: "2023-05-05"
  },
  {
    id: "4",
    type: "strategy",
    title: "Q2 Social Media Strategy",
    content: "## Content Themes\n- Monday: Motivation\n- Wednesday: How-to guides\n- Friday: User testimonials\n\n## Posting Schedule\n- Instagram: 3x weekly\n- LinkedIn: 2x weekly\n- TikTok: Daily",
    date: "2023-05-01"
  }
];

interface SavedItem {
  id: string;
  type: "ideas" | "hooks" | "hashtags" | "strategy";
  title: string;
  content: string;
  date: string;
}

export const SavedContent = () => {
  const [savedItems, setSavedItems] = useState<SavedItem[]>(mockSavedContent);
  const [activeTab, setActiveTab] = useState<string>("all");
  const { toast } = useToast();

  const filteredItems = activeTab === "all" 
    ? savedItems 
    : savedItems.filter(item => item.type === activeTab);

  const deleteItem = (id: string) => {
    setSavedItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Content Deleted",
      description: "The saved content has been removed",
    });
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Content Library</CardTitle>
        <CardDescription>
          Access and manage all your saved content
        </CardDescription>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="ideas">Ideas</TabsTrigger>
            <TabsTrigger value="hooks">Hooks</TabsTrigger>
            <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
            <TabsTrigger value="strategy">Strategies</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {filteredItems.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No saved content in this category</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="capitalize">{item.type}</span>
                      <span>•</span>
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(item.content)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteItem(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none mt-2">
                  <div 
                    className="text-sm text-gray-700 whitespace-pre-line" 
                    dangerouslySetInnerHTML={{ __html: item.content.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>') }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
