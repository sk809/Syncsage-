
import { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon, BotIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Enhanced ChatInterface component directly in the SageBot page
const ChatInterface = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ text: string; type: "user" | "bot" }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, type: "user" as const };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // You'll need to replace this with your Supabase edge function call
      // For now, it's a mock response
      // const response = await fetch('/api/chat-with-gemini', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ prompt: input })
      // });
      
      // Mock response for now
      setTimeout(() => {
        const botReply = { 
          text: `This is a simulated response to: "${input}"\n\nTo connect with Google Gemini API, you'll need to set up a Supabase Edge Function. Would you like me to explain how to do that?`, 
          type: "bot" as const 
        };
        setMessages((prev) => [...prev, botReply]);
        setIsLoading(false);
      }, 1000);
      
      setInput("");
    } catch (error) {
      console.error("Failed to get response:", error);
      toast({
        title: "Error",
        description: "Failed to get response from SageBot.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[60vh]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-md mb-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <BotIcon className="h-12 w-12 text-gray-400 mb-2" />
            <h3 className="text-lg font-medium text-gray-700">Welcome to SageBot</h3>
            <p className="text-sm text-gray-500 max-w-md">
              Your AI content assistant. Ask me about content creation, strategy, or generating ideas!
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.type === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-muted">
              <div className="flex space-x-2">
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={handleKeyPress}
          className="flex-1"
        />
        <Button 
          onClick={sendMessage} 
          disabled={isLoading || !input.trim()}
          size="icon"
        >
          <SendIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Content Creator component
const ContentCreator = () => {
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState("");
  const [tone, setTone] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  const generateContent = () => {
    if (!topic || !contentType) {
      toast({
        title: "Missing fields",
        description: "Please fill in the required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    // Mock content generation
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Content Generated",
        description: "Your content has been generated successfully.",
      });
    }, 2000);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Content</CardTitle>
        <CardDescription>
          Specify your content requirements and let SageBot generate it for you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Topic or Niche*</label>
          <Input 
            value={topic} 
            onChange={(e) => setTopic(e.target.value)} 
            placeholder="E.g., sustainable fashion, productivity tips"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Content Type*</label>
          <Input 
            value={contentType} 
            onChange={(e) => setContentType(e.target.value)} 
            placeholder="E.g., Instagram post, YouTube script, blog post"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Tone or Style</label>
          <Input 
            value={tone} 
            onChange={(e) => setTone(e.target.value)} 
            placeholder="E.g., professional, casual, humorous"
          />
        </div>
        
        <Button 
          className="w-full" 
          onClick={generateContent}
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate Content"}
        </Button>
      </CardContent>
    </Card>
  );
};

// Content Strategy component
const ContentStrategy = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Strategy</CardTitle>
        <CardDescription>
          Let SageBot help you plan and optimize your content strategy
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">This feature is coming soon!</p>
          <p className="text-sm text-muted-foreground">
            Content strategy planning and optimization tools will be available in the next update.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Saved Content component
const SavedContent = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Content</CardTitle>
        <CardDescription>
          Access your saved content and templates
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">No saved content yet</p>
          <p className="text-sm text-muted-foreground">
            Generated content will appear here once you save it.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const SageBot = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">SageBot</h1>
        <p className="text-gray-600">Your AI-powered content creation assistant</p>
      </div>
      
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="create">Create Content</TabsTrigger>
          <TabsTrigger value="chat">Chat Assistant</TabsTrigger>
          <TabsTrigger value="strategy">Content Strategy</TabsTrigger>
          <TabsTrigger value="library">Saved Library</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create">
          <ContentCreator />
        </TabsContent>
        
        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Chat with SageBot</CardTitle>
              <CardDescription>
                Ask any questions about content creation, marketing strategies, or get detailed assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChatInterface />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="strategy">
          <ContentStrategy />
        </TabsContent>
        
        <TabsContent value="library">
          <SavedContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SageBot;
