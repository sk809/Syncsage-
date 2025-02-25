
import { ChatInterface } from "@/components/Chat/ChatInterface";

const SageBot = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sage Bot Assistant</h1>
        <p className="text-gray-600">Your AI-powered content creation assistant</p>
      </div>
      <ChatInterface />
    </div>
  );
};

export default SageBot;
