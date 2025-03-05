
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Loader2, Lightbulb, Hash, TrendingUp, Save, Copy, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ContentRequest {
  topic: string;
  contentType: string;
  tone: string;
  additionalInfo: string;
  contentLength: string;
}

export const ContentCreator = () => {
  const [activeTab, setActiveTab] = useState("ideas");
  const [formData, setFormData] = useState<ContentRequest>({
    topic: "",
    contentType: "instagram",
    tone: "casual",
    additionalInfo: "",
    contentLength: "medium"
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateContent = async () => {
    if (!formData.topic) {
      toast({
        variant: "destructive",
        title: "Topic Required",
        description: "Please enter a topic for your content",
      });
      return;
    }

    setLoading(true);
    setResult("");

    try {
      console.log("Starting content generation process...");
      
      // Construct the prompt based on what we're generating
      let prompt = "";
      
      switch (activeTab) {
        case "ideas":
          prompt = `Generate 5 creative content ideas for ${formData.contentType} about "${formData.topic}". The tone should be ${formData.tone}. Content length: ${formData.contentLength}. ${formData.additionalInfo}`;
          break;
        case "hooks":
          prompt = `Create 5 attention-grabbing viral hooks for ${formData.contentType} content about "${formData.topic}". The tone should be ${formData.tone}. ${formData.additionalInfo}`;
          break;
        case "hashtags":
          prompt = `Generate 15 effective hashtags for ${formData.contentType} content about "${formData.topic}", organized by popularity and relevance. ${formData.additionalInfo}`;
          break;
        default:
          prompt = `Generate content ideas for ${formData.contentType} about "${formData.topic}"`;
      }

      console.log("Using prompt:", prompt);

      const { data, error } = await supabase.functions.invoke("chat-with-ai", {
        body: { 
          messages: [{ role: "user", content: prompt }]
        },
      });

      console.log("Response received:", data);
      console.log("Error (if any):", error);

      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(`Supabase function error: ${error.message}`);
      }

      if (!data?.choices?.[0]?.message?.content) {
        console.error("Invalid AI response structure:", data);
        throw new Error("Invalid response from AI");
      }

      setResult(data.choices[0].message.content);
    } catch (error) {
      console.error('Content generation error:', error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate content. Please check that GEMINI_API_KEY is set in your Supabase Edge Function secrets.",
      });
    } finally {
      setLoading(false);
    }
  };

  const regenerateContent = () => {
    generateContent();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
  };

  const saveToLibrary = () => {
    toast({
      title: "Content Saved",
      description: "Content has been saved to your library",
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Content Details</CardTitle>
          <CardDescription>
            Tell SageBot what kind of content you want to create
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic or Niche</Label>
            <Input 
              id="topic" 
              name="topic" 
              placeholder="e.g., Sustainable fashion, Productivity tips, Home workouts" 
              value={formData.topic}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contentType">Content Type</Label>
            <Select 
              value={formData.contentType} 
              onValueChange={(value) => handleSelectChange("contentType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram Post</SelectItem>
                <SelectItem value="tiktok">TikTok Video</SelectItem>
                <SelectItem value="youtube">YouTube Video</SelectItem>
                <SelectItem value="blog">Blog Post</SelectItem>
                <SelectItem value="twitter">Twitter/X Post</SelectItem>
                <SelectItem value="linkedin">LinkedIn Post</SelectItem>
                <SelectItem value="facebook">Facebook Post</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tone">Tone of Voice</Label>
            <Select 
              value={formData.tone} 
              onValueChange={(value) => handleSelectChange("tone", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casual">Casual & Conversational</SelectItem>
                <SelectItem value="professional">Professional & Informative</SelectItem>
                <SelectItem value="humorous">Humorous & Entertaining</SelectItem>
                <SelectItem value="inspirational">Inspirational & Motivational</SelectItem>
                <SelectItem value="educational">Educational & Helpful</SelectItem>
                <SelectItem value="storytelling">Storytelling & Narrative</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contentLength">Content Length</Label>
            <Select 
              value={formData.contentLength} 
              onValueChange={(value) => handleSelectChange("contentLength", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select length" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short (50-100 words)</SelectItem>
                <SelectItem value="medium">Medium (100-300 words)</SelectItem>
                <SelectItem value="long">Long (300+ words)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Additional Requirements (Optional)</Label>
            <Textarea 
              id="additionalInfo" 
              name="additionalInfo" 
              placeholder="Any specific themes, keywords, or restrictions?" 
              value={formData.additionalInfo}
              onChange={handleChange}
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="ideas" className="text-xs flex gap-1 items-center">
                <Lightbulb className="w-3 h-3" />
                Content Ideas
              </TabsTrigger>
              <TabsTrigger value="hooks" className="text-xs flex gap-1 items-center">
                <TrendingUp className="w-3 h-3" />
                Viral Hooks
              </TabsTrigger>
              <TabsTrigger value="hashtags" className="text-xs flex gap-1 items-center">
                <Hash className="w-3 h-3" />
                Hashtags
              </TabsTrigger>
            </TabsList>
            
            <Button 
              onClick={generateContent} 
              disabled={loading || !formData.topic}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                `Generate ${activeTab === "ideas" ? "Content Ideas" : activeTab === "hooks" ? "Viral Hooks" : "Hashtags"}`
              )}
            </Button>
          </Tabs>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === "ideas" 
              ? "Content Ideas" 
              : activeTab === "hooks" 
                ? "Viral Hooks" 
                : "Hashtag Suggestions"}
          </CardTitle>
          <CardDescription>
            {activeTab === "ideas" 
              ? "Creative content ideas based on your topic" 
              : activeTab === "hooks" 
                ? "Attention-grabbing hooks for your content" 
                : "Relevant hashtags to boost your content's reach"}
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-sm text-gray-500">Generating amazing content...</p>
              </div>
            </div>
          ) : result ? (
            <div className="prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ 
                __html: result.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>') 
              }} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center p-6">
              <p className="text-gray-500">
                Fill in the details and click generate to create 
                {activeTab === "ideas" 
                  ? " content ideas" 
                  : activeTab === "hooks" 
                    ? " viral hooks" 
                    : " hashtag suggestions"}
              </p>
            </div>
          )}
        </CardContent>
        {result && (
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={regenerateContent}>
              <RotateCcw className="mr-2 h-3 w-3" />
              Regenerate
            </Button>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="mr-2 h-3 w-3" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={saveToLibrary}>
                <Save className="mr-2 h-3 w-3" />
                Save
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
