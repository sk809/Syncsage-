import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Send, Bot, AlertCircle } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";
import { useGemini } from "@/contexts/GeminiContext";
import { chatWithGemini, Message } from "@/lib/gemini";

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const location = useLocation();
  const { apiKey } = useGemini();
  const isLandingPage = location.pathname === "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setError(null);
    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Call the Gemini API directly
      const response = await chatWithGemini([...messages, userMessage], apiKey);
      
      // If we got a response back, add it to messages
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "AI Response Error",
        description: `Failed to get AI response. Please try again later.`,
      });
      
      // Our updated gemini.ts handles errors gracefully, but in case we get one here:
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "I'm sorry, I encountered an error processing your request. Please try again in a moment."
      }]);
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
          <h3 className="text-xl font-medium text-gray-900">Sage Bot</h3>
          <p className="text-gray-500 max-w-sm">
            Hey there! I'm Sage Bot, your AI content assistant. Ask me anything about content creation, analytics, or strategy!
          </p>
        </div>
      )}
      
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${messages.length > 0 ? 'block' : 'hidden'}`}>
        {messages.map((message, index) => (
          <ChatMessage key={index} role={message.role} content={message.content} />
        ))}
        {loading && (
          <div className="flex justify-center py-2">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md flex items-start gap-2">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Connection error</p>
              <p className="text-sm">There was a problem connecting to the AI service. Please try again.</p>
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Sage Bot anything..."
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
