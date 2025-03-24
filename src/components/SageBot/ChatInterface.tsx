import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Send, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from "./ChatMessage";
import { Input } from "@/components/ui/input";
import { cleanCssFromText } from "@/lib/utils";

interface Message {
  role: "assistant" | "user";
  content: string;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Placeholder response - in a real implementation, this would be the AI response
      // that needs to be cleaned
      let aiResponse = "Top 10 Booming Niches Right Now 🚀\n\nIt's tough to definitively say what's *most* booming, as trends change rapidly. However, these niches are experiencing significant growth and offer strong potential:\n\n1. Artificial Intelligence (AI) & Machine Learning: AI tools and services are everywhere, from marketing to customer service. This includes AI writing tools, image generators, and more.\n\n2. Sustainable and Eco-Friendly Products: Consumers are increasingly environmentally conscious, driving demand for sustainable alternatives across industries.";
      
      // Clean the response of any CSS class references
      aiResponse = cleanCssFromText(aiResponse);
      
      const assistantMessage: Message = {
        role: "assistant",
        content: aiResponse
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      toast({
        variant: "destructive",
        title: "AI Response Error",
        description: `Failed to get AI response. Please try again later.`,
      });
      
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "I'm sorry, I encountered an error processing your request. Please try again in a moment. 😔"
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="flex flex-col h-[600px] relative bg-white rounded-lg shadow-sm border"
    >
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-medium text-gray-900">SageBot Assistant</h3>
          <p className="text-gray-500 max-w-lg">
            Ask me anything about content creation! I can help with content ideas, viral hooks, hashtags, and content strategies for social media, blogs, videos, and more. ✨
          </p>
        </div>
      )}
      
      <div 
        className={`${messages.length > 0 ? 'flex-1 overflow-y-auto p-4 space-y-4' : 'hidden'}`}
      >
        {messages.map((message, index) => (
          <ChatMessage 
            key={index} 
            role={message.role} 
            content={message.content} 
          />
        ))}
        {loading && (
          <div className="flex justify-center py-2">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask SageBot about content creation..."
            className="flex-1 focus-visible:ring-purple-500"
            disabled={loading}
          />
          <Button 
            type="submit" 
            disabled={loading}
            className={`transition-all duration-200 ${!input.trim() ? 'opacity-50' : 'hover:bg-purple-700'}`}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
