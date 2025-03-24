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
import { Label } from "@/components/ui/label";
import { Loader2, Calendar, Download, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGemini } from "@/contexts/GeminiContext";
import { chatWithGemini, Message } from "@/lib/gemini";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cleanCssFromText } from "@/lib/utils";

export const ContentStrategy = () => {
  const { toast } = useToast();
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [timeframe, setTimeframe] = useState("weekly");
  const [frequency, setFrequency] = useState("daily");
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState("");
  const { apiKey } = useGemini();

  const generateStrategy = async () => {
    if (!niche) return;
    
    setLoading(true);
    setStrategy("");
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock strategy response based on inputs
      let mockStrategy = `# Content Strategy for ${niche} on ${platform.charAt(0).toUpperCase() + platform.slice(1)}\n\n`;
      
      mockStrategy += `## Overview\nThis ${timeframe} strategy focuses on growing your ${niche} presence on ${platform} with a ${frequency} posting schedule.\n\n`;
      
      mockStrategy += `## Content Pillars\n`;
      mockStrategy += `1. Educational content about ${niche}\n`;
      mockStrategy += `2. Behind-the-scenes of your ${niche} business\n`;
      mockStrategy += `3. User-generated content and testimonials\n`;
      mockStrategy += `4. Trend participation relevant to ${niche}\n\n`;
      
      mockStrategy += `## Posting Schedule\n`;
      switch (frequency) {
        case "daily":
          mockStrategy += `- Monday: Educational post about ${niche}\n`;
          mockStrategy += `- Tuesday: Engagement question related to ${niche}\n`;
          mockStrategy += `- Wednesday: Product/service highlight\n`;
          mockStrategy += `- Thursday: Industry news or trends\n`;
          mockStrategy += `- Friday: Fun/relatable content\n`;
          mockStrategy += `- Saturday: User testimonial or feature\n`;
          mockStrategy += `- Sunday: Inspirational content\n\n`;
          break;
        case "3x-weekly":
          mockStrategy += `- Monday: Educational deep-dive on ${niche}\n`;
          mockStrategy += `- Wednesday: Product showcase or behind-the-scenes\n`;
          mockStrategy += `- Friday: Community engagement or trending topic\n\n`;
          break;
        case "weekly":
          mockStrategy += `- Choose one day per week (recommend ${platform === "linkedin" ? "Tuesday or Thursday" : platform === "instagram" ? "Wednesday" : "Monday"}) to post high-quality content about ${niche}\n\n`;
          break;
      }
      
      mockStrategy += `## Content Types for ${platform}\n`;
      switch (platform) {
        case "instagram":
          mockStrategy += `- Carousel posts: Educational series about ${niche}\n`;
          mockStrategy += `- Reels: Quick tips and trending sounds\n`;
          mockStrategy += `- Stories: Daily updates and behind-the-scenes\n`;
          break;
        case "tiktok":
          mockStrategy += `- Trending sounds with ${niche} relevance\n`;
          mockStrategy += `- Tutorial videos (15-60 seconds)\n`;
          mockStrategy += `- Day-in-the-life of a ${niche} professional\n`;
          break;
        default:
          mockStrategy += `- Regular posts about ${niche}\n`;
          mockStrategy += `- Engagement posts (questions, polls)\n`;
          mockStrategy += `- Promotional content (20% maximum)\n`;
      }
      
      // Clean any CSS class names from the response
      mockStrategy = cleanCssFromText(mockStrategy);
      
      setStrategy(mockStrategy);
    } catch (error) {
      console.error("Error generating strategy:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "There was an error generating your content strategy.",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(strategy);
    toast({
      title: "Copied to Clipboard",
      description: "Content strategy has been copied to your clipboard"
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Content Strategy Generator</CardTitle>
          <CardDescription>
            Create a custom content strategy plan for your niche
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="niche">Niche or Topic</Label>
            <Input
              id="niche"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g., Fitness, Digital Marketing, Sustainable Fashion"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="platform">Platform</Label>
            <Select
              value={platform}
              onValueChange={setPlatform}
            >
              <SelectTrigger id="platform">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timeframe">Timeframe</Label>
              <Select
                value={timeframe}
                onValueChange={setTimeframe}
              >
                <SelectTrigger id="timeframe">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="frequency">Post Frequency</Label>
              <Select
                value={frequency}
                onValueChange={setFrequency}
              >
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="3x-weekly">3x Weekly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button
            onClick={generateStrategy}
            disabled={loading || !niche}
            className="w-full mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Generate Content Strategy
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Strategy Plan</CardTitle>
          <CardDescription>
            Custom content strategy based on your requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4 min-h-[400px] relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : strategy ? (
              <div className="whitespace-pre-wrap">
                {strategy.split('\n').map((line, i) => {
                  // Determine styling based on markdown-like headings without using class names
                  if (line.startsWith('# ')) {
                    return <h1 key={i} style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{line.substring(2)}</h1>;
                  } else if (line.startsWith('## ')) {
                    return <h2 key={i} style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', marginTop: '1rem' }}>{line.substring(3)}</h2>;
                  } else if (line.startsWith('- ')) {
                    return <div key={i} style={{ paddingLeft: '1rem', marginBottom: '0.25rem' }}>• {line.substring(2)}</div>;
                  } else if (/^\d+\.\s/.test(line)) {
                    return <div key={i} style={{ paddingLeft: '1rem', marginBottom: '0.25rem' }}>{line}</div>;
                  } else if (line === '') {
                    return <div key={i} style={{ height: '0.5rem' }}></div>;
                  } else {
                    return <p key={i} style={{ marginBottom: '0.5rem' }}>{line}</p>;
                  }
                })}
              </div>
            ) : (
              <div className="text-center text-gray-500 h-full flex flex-col items-center justify-center">
                <Calendar className="h-8 w-8 mb-2 text-gray-400" />
                <p>Enter your niche and preferences to generate a strategy</p>
              </div>
            )}
          </div>
        </CardContent>
        {strategy && (
          <CardFooter className="justify-end gap-2">
            <Button variant="outline" onClick={copyToClipboard}>
              <Copy className="mr-2 h-4 w-4" />
              Copy to Clipboard
            </Button>
            <Button onClick={() => {
              toast({
                title: "Strategy Saved",
                description: "Content strategy has been saved to your library"
              });
            }}>
              <Download className="mr-2 h-4 w-4" />
              Save Strategy
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
