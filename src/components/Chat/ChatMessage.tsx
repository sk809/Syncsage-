
import { Avatar } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "assistant" | "user";
  content: string;
}

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const formatContent = (text: string) => {
    // Format headings
    text = text.replace(/##\s*(.*)/g, '<h2 class="text-lg font-semibold text-gray-900 mt-4 mb-2">$1</h2>');
    
    // Format bold text/subheadings
    text = text.replace(/\*\*(.*?)\*\*/g, '<span class="font-semibold text-gray-800">$1</span>');
    
    // Format bullet points
    text = text.replace(/•\s*(.*)/g, '<li class="ml-4">$1</li>');
    
    // Convert line breaks to proper spacing
    text = text.replace(/\n\n/g, '</p><p class="mt-3">');
    text = text.replace(/\n/g, '<br>');
    
    return `<p class="text-sm text-gray-800">${text}</p>`;
  };

  return (
    <div className={`flex gap-3 ${role === "assistant" ? "bg-gray-50" : ""} p-4 rounded-lg`}>
      <Avatar className={`${role === "assistant" ? "bg-gradient-to-br from-purple-600 to-indigo-600" : "bg-gray-500"} ring-2 ring-white shrink-0`}>
        {role === "assistant" ? (
          <Bot className="w-5 h-5 text-white animate-in zoom-in duration-200" />
        ) : (
          <User className="w-5 h-5 text-white" />
        )}
      </Avatar>
      <div className="flex-1">
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: role === "assistant" ? formatContent(content) : content }}
        />
      </div>
    </div>
  );
};
