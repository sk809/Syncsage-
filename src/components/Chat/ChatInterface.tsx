
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
  const [apiKeyError, setApiKeyError] = useState(false);
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
    setApiKeyError(false);

    try {
      // Make the API call with detailed console logging for debugging
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
      
      // Check if the error is related to the API key
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      const isApiKeyError = errorMessage.includes("API key") || 
                           errorMessage.includes("GEMINI_API_KEY") || 
                           errorMessage.includes("configuration error");
      
      if (isApiKeyError) {
        setApiKeyError(true);
      }
      
      toast({
        variant: "destructive",
        title: "AI Response Error",
        description: `Failed to get AI response: ${errorMessage}. ${isApiKeyError ? 
          "Please make sure the GEMINI_API_KEY is set in your Supabase Edge Function secrets." : 
          "Please try again later."}`,
      });
      
      // Add a fallback AI response
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: isApiKeyError ? 
          "I'm sorry, I encountered an error processing your request. It looks like there's an issue with the API key configuration. Please make sure the GEMINI_API_KEY is properly set in the Supabase Edge Function secrets." : 
          "I'm sorry, I encountered an error processing your request. Please try again in a moment."
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
          {apiKeyError && (
            <div className="mt-2 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              <p className="font-semibold">API Key Configuration Error</p>
              <p>The GEMINI_API_KEY is not properly configured in the Supabase Edge Function secrets.</p>
            </div>
          )}
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
        {apiKeyError && (
          <div className="mt-3 p-2 bg-red-50 text-red-700 rounded-md text-xs">
            API key error detected. Please check the GEMINI_API_KEY in Supabase Edge Function secrets.
          </div>
        )}
      </form>
    </div>
  );
};

