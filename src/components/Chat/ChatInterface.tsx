
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Send, Bot } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";

interface Message {
  role: "assistant" | "user";
  content: string;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("chat-with-ai", {
        body: { messages: [...messages, userMessage] },
      });

      if (error) throw error;

      if (!data?.choices?.[0]?.message?.content) {
        throw new Error("Invalid response from AI");
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.choices[0].message.content,
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get AI response. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col ${isLandingPage ? "h-[400px]" : "h-[600px]"} bg-white rounded-lg shadow-lg`}>
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-medium text-gray-900">AI Content Assistant</h3>
          <p className="text-gray-500 max-w-sm">
            Ask me anything about content creation, analytics, or strategy. I'm here to help you grow your audience!
          </p>
        </div>
      )}
      
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${messages.length > 0 ? 'block' : 'hidden'}`}>
        {messages.map((message, index) => (
          <ChatMessage key={index} role={message.role} content={message.content} />
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading}
          />
          <Button 
            type="submit" 
            disabled={loading}
            className={isLandingPage ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700" : ""}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
