
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Send, Bot, RotateCcw, Save, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from "./ChatMessage";
import { Input } from "@/components/ui/input";

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
      console.log("Sending message to AI:", userMessage);
      console.log("All messages being sent:", [...messages, userMessage]);
      
      const { data, error } = await supabase.functions.invoke("chat-with-ai", {
        body: { messages: [...messages, userMessage] },
      });

      console.log("Response from AI service:", data);
      
      if (error) {
        console.error("Supabase function error:", error);
        throw error;
      }

      if (!data?.choices?.[0]?.message?.content) {
        console.error("Invalid AI response structure:", data);
        throw new Error("Invalid response from AI");
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.choices[0].message.content,
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Unknown error occurred";
        
      toast({
        variant: "destructive",
        title: "AI Response Error",
        description: `Failed to get AI response: ${errorMessage}. Please try again.`,
      });
      
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "I'm sorry, I encountered an error processing your request. Please try again in a moment."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const regenerateResponse = async () => {
    if (messages.length < 2 || loading) return;
    
    // Remove the last assistant message
    const lastUserMessageIndex = messages.map(m => m.role).lastIndexOf("user");
    if (lastUserMessageIndex === -1) return;
    
    const lastUserMessage = messages[lastUserMessageIndex];
    const messagesToKeep = messages.slice(0, lastUserMessageIndex);
    
    setMessages(messagesToKeep);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("chat-with-ai", {
        body: { messages: [...messagesToKeep, lastUserMessage] },
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
      console.error('Regeneration error:', error);
      toast({
        variant: "destructive",
        title: "Regeneration Failed",
        description: "Failed to regenerate response. Please try again.",
      });
      
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "I'm sorry, I encountered an error regenerating the response. Please try again."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const saveToLibrary = (content: string) => {
    // This will be implemented later with the SavedContent component
    toast({
      title: "Content Saved",
      description: "Content has been saved to your library",
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
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-sm border">
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-medium text-gray-900">SageBot Assistant</h3>
          <p className="text-gray-500 max-w-lg">
            Ask me anything about content creation! I can help with content ideas, viral hooks, hashtags, and content strategies for social media, blogs, videos, and more.
          </p>
        </div>
      )}
      
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${messages.length > 0 ? 'block' : 'hidden'}`}>
        {messages.map((message, index) => (
          <ChatMessage 
            key={index} 
            role={message.role} 
            content={message.content} 
            onSave={() => saveToLibrary(message.content)}
            onCopy={() => copyToClipboard(message.content)}
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
        {messages.length > 0 && (
          <div className="flex justify-end mb-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={regenerateResponse}
              disabled={loading || messages.length < 2}
              className="text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Regenerate
            </Button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask SageBot about content creation..."
            className="flex-1"
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
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
