
import { Avatar } from "@/components/ui/avatar";
import { Bot, User, Save, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatMessageProps {
  role: "assistant" | "user";
  content: string;
  onSave?: () => void;
  onCopy?: () => void;
}

export const ChatMessage = ({ role, content, onSave, onCopy }: ChatMessageProps) => {
  const formatContent = (text: string) => {
    // Format headings
    text = text.replace(/##\s*(.*)/g, '<h2 class="text-lg font-semibold text-gray-900 mt-4 mb-2">$1</h2>');
    
    // Format bold text/subheadings
    text = text.replace(/\*\*(.*?)\*\*/g, '<span class="font-semibold text-gray-800">$1</span>');
    
    // Format bullet points
    text = text.replace(/•\s*(.*)/g, '<li class="ml-4">$1</li>');
    text = text.replace(/- (.*)/g, '<li class="ml-4">$1</li>');
    
    // Format numbered lists
    text = text.replace(/(\d+)\.\s*(.*)/g, '<div class="flex gap-2"><span>$1.</span><span>$2</span></div>');
    
    // Format code blocks
    text = text.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-3 rounded my-2 overflow-x-auto text-sm">$1</pre>');
    
    // Format inline code
    text = text.replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>');
    
    // Convert line breaks to proper spacing
    text = text.replace(/\n\n/g, '</p><p class="mt-3">');
    text = text.replace(/\n/g, '<br>');
    
    return `<p class="text-sm text-gray-800">${text}</p>`;
  };

  return (
    <div className={`flex gap-3 ${role === "assistant" ? "bg-gray-50" : ""} p-4 rounded-lg`}>
      <Avatar className={`${role === "assistant" ? "bg-gradient-to-br from-purple-600 to-indigo-600" : "bg-gray-500"} ring-2 ring-white shrink-0 h-8 w-8`}>
        {role === "assistant" ? (
          <Bot className="w-4 h-4 text-white animate-in zoom-in duration-200" />
        ) : (
          <User className="w-4 h-4 text-white" />
        )}
      </Avatar>
      <div className="flex-1">
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: role === "assistant" ? formatContent(content) : content }}
        />
        
        {role === "assistant" && (
          <div className="flex gap-2 mt-2 justify-end">
            {onCopy && (
              <Button variant="ghost" size="sm" onClick={onCopy} className="h-7 px-2">
                <Copy className="h-3 w-3 mr-1" />
                <span className="text-xs">Copy</span>
              </Button>
            )}
            {onSave && (
              <Button variant="ghost" size="sm" onClick={onSave} className="h-7 px-2">
                <Save className="h-3 w-3 mr-1" />
                <span className="text-xs">Save</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
