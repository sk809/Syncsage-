
import { Avatar } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "assistant" | "user";
  content: string;
}

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  return (
    <div className={`flex gap-3 ${role === "assistant" ? "bg-gray-50" : ""} p-4 rounded-lg`}>
      <Avatar className={`${role === "assistant" ? "bg-gradient-to-br from-purple-600 to-indigo-600" : "bg-gray-500"} ring-2 ring-white`}>
        {role === "assistant" ? (
          <Bot className="w-5 h-5 text-white animate-in zoom-in duration-200" />
        ) : (
          <User className="w-5 h-5 text-white" />
        )}
      </Avatar>
      <div className="flex-1">
        <p className="text-sm text-gray-800 whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
};
