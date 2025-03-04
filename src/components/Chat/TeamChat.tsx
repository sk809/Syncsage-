
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { Avatar } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface Message {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  user_details?: {
    full_name?: string;
    email?: string;
  };
}

export function TeamChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("chat_messages")
        .select(`
          id, content, user_id, created_at,
          profiles:user_id (full_name, email)
        `)
        .order("created_at", { ascending: true });

      setLoading(false);
      
      if (error) {
        console.error("Error fetching messages:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load messages",
        });
        return;
      }

      // Process data to format user details
      const formattedMessages = data.map((message) => ({
        id: message.id,
        content: message.content,
        user_id: message.user_id,
        created_at: message.created_at,
        user_details: message.profiles as any,
      }));

      setMessages(formattedMessages);
      scrollToBottom();
    };

    fetchMessages();

    // Setup real-time subscription for new messages
    const setupRealtimeSubscription = () => {
      const channel = supabase
        .channel("chat_messages")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "chat_messages",
          },
          async (payload) => {
            const { data: userProfile, error: profileError } = await supabase
              .from("profiles")
              .select("full_name, email")
              .eq("id", payload.new.user_id)
              .single();

            if (profileError) {
              console.error("Error fetching user profile:", profileError);
            }

            const newMessage = {
              ...payload.new as Message,
              user_details: userProfile || {},
            };

            setMessages((prev) => [...prev, newMessage]);
            scrollToBottom();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    const cleanup = setupRealtimeSubscription();
    return cleanup;
  }, [toast]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      const { error } = await supabase.from("chat_messages").insert({
        content: newMessage.trim(),
        user_id: user.id,
      });

      if (error) throw error;

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message",
      });
    }
  };

  const getUserDisplayName = (message: Message) => {
    if (message.user_id === user?.id) return "You";
    return message.user_details?.full_name || message.user_details?.email || "Anonymous";
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-5xl mx-auto p-4 animate-fade-in">
      <div className="bg-card rounded-lg shadow-lg flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Team Chat</h2>
          <p className="text-sm text-muted-foreground">
            Collaborate with your team in real-time
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading && (
            <div className="flex justify-center py-6">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}
          
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="bg-muted rounded-full p-4 mb-4">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No messages yet</h3>
              <p className="text-muted-foreground">
                Start a conversation with your team
              </p>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.user_id === user?.id ? "justify-end" : ""
              }`}
            >
              {message.user_id !== user?.id && (
                <Avatar className="h-8 w-8 bg-primary">
                  <User className="h-4 w-4 text-primary-foreground" />
                </Avatar>
              )}
              
              <div
                className={`rounded-lg px-4 py-2 max-w-[70%] ${
                  message.user_id === user?.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {message.user_id !== user?.id && (
                  <p className="text-xs font-medium mb-1">
                    {getUserDisplayName(message)}
                  </p>
                )}
                <p className="break-words">{message.content}</p>
                <div className="text-xs opacity-70 mt-1">
                  {formatDistanceToNow(new Date(message.created_at), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={!user}
            />
            <Button 
              type="submit" 
              disabled={!newMessage.trim() || !user}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              animated
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {!user && (
            <p className="text-xs text-muted-foreground mt-2">
              Please sign in to send messages
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
