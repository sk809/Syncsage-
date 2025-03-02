
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
import { supabase } from "@/integrations/supabase/client";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export const ContentStrategy = () => {
  const { toast } = useToast();
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [timeframe, setTimeframe] = useState("weekly");
  const [frequency, setFrequency] = useState("daily");
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState("");

  const generateStrategy = async () => {
    if (!niche) {
      toast({
        variant: "destructive",
        title: "Niche Required",
        description: "Please enter your niche or topic",
      });
      return;
    }

    setLoading(true);
    try {
      const prompt = `Create a detailed ${timeframe} content strategy for a ${niche} account on ${platform}. The strategy should include ${frequency} posts, content themes, optimal posting times, content types (video, image, carousel, etc.), and engagement strategies. Format the response in a clear, structured way with sections and bullet points.`;

      const { data, error } = await supabase.functions.invoke("chat-with-ai", {
        body: { 
          messages: [{ role: "user", content: prompt }]
        },
      });

      if (error) throw error;

      if (!data?.choices?.[0]?.message?.content) {
        throw new Error("Invalid response from AI");
      }

      setStrategy(data.choices[0].message.content);
    } catch (error) {
      console.error('Strategy generation error:', error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Failed to generate content strategy. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(strategy);
    toast({
      title: "Copied!",
      description: "Strategy copied to clipboard",
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Content Strategy Generator</CardTitle>
          <CardDescription>
            Create a tailored content strategy for your brand or business
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="niche">Niche or Industry</Label>
            <Input 
              id="niche" 
              placeholder="e.g., Fitness coaching, Vegan recipes, Tech reviews" 
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="platform">Primary Platform</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="twitter">Twitter/X</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="blog">Blog</SelectItem>
                <SelectItem value="multi">Multi-platform</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timeframe">Strategy Timeframe</Label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger>
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly (3 months)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="frequency">Posting Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="3-times-weekly">3 Times a Week</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={generateStrategy} 
            disabled={loading || !niche}
            className="w-full flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating Strategy...
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4" />
                Generate Content Strategy
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Content Strategy</CardTitle>
          <CardDescription>
            A customized plan for creating and sharing content
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px] max-h-[500px] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-sm text-gray-500">Creating your content strategy...</p>
              </div>
            </div>
          ) : strategy ? (
            <div className="prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ 
                __html: strategy.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>') 
              }} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center p-6">
              <p className="text-gray-500">
                Fill in the details and click generate to create your custom content strategy
              </p>
            </div>
          )}
        </CardContent>
        {strategy && (
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy className="mr-2 h-3 w-3" />
              Copy
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-3 w-3" />
              Download
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
