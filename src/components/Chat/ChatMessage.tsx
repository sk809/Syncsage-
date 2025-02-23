
import { Avatar } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "assistant" | "user";
  content: string;
}

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  return (
    <div className={`flex gap-3 ${role === "assistant" ? "bg-gray-50" : ""} p-4 rounded-lg`}>
      <Avatar className={role === "assistant" ? "bg-primary" : "bg-gray-500"}>
        {role === "assistant" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
      </Avatar>
      <div className="flex-1">
        <p className="text-sm text-gray-800 whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
};
