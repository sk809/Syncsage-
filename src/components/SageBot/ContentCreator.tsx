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
import { Loader2, Lightbulb, Hash, TrendingUp, Save, Copy, RotateCcw, RefreshCcw, Sparkles, LightbulbIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGemini } from "@/contexts/GeminiContext";
import { chatWithGemini, Message } from "@/lib/gemini";
import { supabase } from "@/integrations/supabase/client";
import { cleanCssFromText } from "@/lib/utils";

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
  const { apiKey } = useGemini();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateContent = async () => {
    if (!formData.topic) return;
    
    setLoading(true);
    setResult("");
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get mock response based on content type
      let mockResponse = "";
      switch (formData.contentType) {
        case "instagram":
          mockResponse = `📸 *${formData.topic}* 📸\n\nHave you ever wondered about ${formData.topic}? Here's what I discovered!\n\n${formData.tone === "humorous" ? "😂 " : ""}This ${formData.contentLength === "short" ? "quick" : "deep-dive"} exploration of ${formData.topic} changed how I see things.\n\n${formData.additionalInfo ? formData.additionalInfo + "\n\n" : ""}What's your experience with this? Share below! 👇\n\n#${formData.topic.replace(/\s+/g, '')} #ContentCreation #Trending`;
          break;
        case "tiktok":
          mockResponse = `TikTok Script - ${formData.topic}\n\n[Hook] You won't believe what happens when you learn about ${formData.topic}!\n\n[Main Content]\n- Point 1: Introduction to ${formData.topic}\n- Point 2: Why it matters\n- Point 3: How to use this info\n\n[Call to Action]\nFollow for more ${formData.contentType} content! Comment your thoughts below!`;
          break;
        default:
          mockResponse = `# Content about ${formData.topic}\n\nThis is a ${formData.tone} piece about ${formData.topic}. The length is ${formData.contentLength}.\n\n## Main Points\n\n1. First point about ${formData.topic}\n2. Second interesting fact\n3. Conclusion and thoughts\n\n${formData.additionalInfo ? "Additional context: " + formData.additionalInfo : ""}`;
      }
      
      // Clean the response of any CSS class references
      mockResponse = cleanCssFromText(mockResponse);
      
      setResult(mockResponse);
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "There was an error generating your content. Please try again.",
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
      title: "Copied to Clipboard",
      description: "Content has been copied to your clipboard"
    });
  };

  const saveToLibrary = () => {
    toast({
      title: "Saved to Library",
      description: "Content has been saved to your library"
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Generator</CardTitle>
          <CardDescription>Create AI-generated content in seconds</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="ideas" className="flex items-center gap-1">
                <Lightbulb className="w-4 h-4" />
                Ideas
              </TabsTrigger>
              <TabsTrigger value="hooks" className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                Hooks
              </TabsTrigger>
              <TabsTrigger value="hashtags" className="flex items-center gap-1">
                <Hash className="w-4 h-4" />
                Hashtags
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic or Subject</Label>
              <Input 
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="What is your content about?"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contentType">Content Type</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange("contentType", value)}
                  defaultValue={formData.contentType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="blog">Blog Post</SelectItem>
                    <SelectItem value="twitter">Twitter/X</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange("tone", value)}
                  defaultValue={formData.tone}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="humorous">Humorous</SelectItem>
                    <SelectItem value="inspirational">Inspirational</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="persuasive">Persuasive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contentLength">Content Length</Label>
              <Select 
                onValueChange={(value) => handleSelectChange("contentLength", value)}
                defaultValue={formData.contentLength}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="long">Long</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Details (Optional)</Label>
              <Textarea 
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                placeholder="Any specific requirements or additional context..."
                rows={3}
              />
            </div>
            
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
                "Generate Content"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Generated Content</CardTitle>
          <CardDescription>
            {activeTab === "ideas" && "Creative content ideas for your topic"}
            {activeTab === "hooks" && "Attention-grabbing hooks for your content"}
            {activeTab === "hashtags" && "Trending and relevant hashtags"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`bg-gray-50 rounded-lg p-4 min-h-[200px] ${loading ? 'flex items-center justify-center' : ''}`}>
            {loading ? (
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            ) : result ? (
              <div className="bg-gray-50 rounded-lg p-4 min-h-[200px] whitespace-pre-wrap">
                {result.split('\n').map((line, i) => {
                  // Format based on content without using CSS classes
                  if (line.startsWith('# ')) {
                    return <h1 key={i} style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{line.substring(2)}</h1>;
                  } else if (line.startsWith('## ')) {
                    return <h2 key={i} style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', marginTop: '1rem' }}>{line.substring(3)}</h2>;
                  } else if (line.startsWith('- ')) {
                    return <div key={i} style={{ paddingLeft: '1rem', marginBottom: '0.25rem' }}>• {line.substring(2)}</div>;
                  } else if (/^\d+\.\s/.test(line)) {
                    return <div key={i} style={{ paddingLeft: '1rem', marginBottom: '0.25rem' }}>{line}</div>;
                  } else if (line.startsWith('[')) {
                    return <div key={i} style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>{line}</div>;
                  } else if (line === '') {
                    return <div key={i} style={{ height: '0.5rem' }}></div>;
                  } else {
                    return <p key={i} style={{ marginBottom: '0.5rem' }}>{line}</p>;
                  }
                })}
              </div>
            ) : (
              <div className="text-center text-gray-500 h-full flex flex-col items-center justify-center p-12">
                <Sparkles className="h-8 w-8 mb-2 text-gray-400" />
                <p>Generate content using the form above</p>
              </div>
            )}
          </div>
        </CardContent>
        {result && (
          <CardFooter className="flex justify-between gap-2 border-t px-6 py-4">
            <Button variant="outline" onClick={regenerateContent} disabled={loading}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={copyToClipboard}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button onClick={saveToLibrary}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
