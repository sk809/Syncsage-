import { Avatar } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "assistant" | "user";
  content: string;
}

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  // Format text with line breaks and ensure CSS class names are not displayed
  const formatText = (text: string): string => {
    return text
      .replace(/\n/g, '<br>')
      // Convert any remaining visible CSS classes to normal text or remove them
      .replace(/\b(text|font|bg|border)-[a-zA-Z0-9-]+\b/g, '');
  };

  return (
    <div className={`flex gap-3 ${role === "assistant" ? "bg-gray-50" : ""} p-4 rounded-lg`}>
      <Avatar className={`${role === "assistant" ? "bg-gradient-to-br from-purple-600 to-indigo-600" : "bg-gray-200"} ring-1 ring-white shrink-0 h-8 w-8`}>
        {role === "assistant" ? (
          <Bot className="w-4 h-4 text-white animate-in zoom-in duration-200" />
        ) : (
          <User className="w-4 h-4 text-gray-600" />
        )}
      </Avatar>
      <div className="flex-1" style={{ textAlign: 'left' }}>
        {role === "assistant" ? (
          <div
            style={{ 
              textAlign: 'left',
              fontSize: '0.875rem',
              lineHeight: '1.5',
              color: '#1f2937'
            }} 
            dangerouslySetInnerHTML={{ __html: formatText(content) }}
          />
        ) : (
          <div style={{ textAlign: 'left' }}>{content}</div>
        )}
      </div>
    </div>
  );
};
