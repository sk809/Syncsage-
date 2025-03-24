import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatInterface } from "@/components/Chat/ChatInterface";
import { ContentCreator } from "@/components/SageBot/ContentCreator";
import { ContentStrategy } from "@/components/SageBot/ContentStrategy";
import { SavedContent } from "@/components/SageBot/SavedContent";

const SageBot = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">SageBot</h1>
        <p className="text-gray-600">Your AI-powered content creation assistant</p>
      </div>
      
      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="chat">Chat Assistant</TabsTrigger>
          <TabsTrigger value="create">Create Content</TabsTrigger>
          <TabsTrigger value="strategy">Content Strategy</TabsTrigger>
          <TabsTrigger value="library">Saved Library</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Chat with SageBot</CardTitle>
              <CardDescription>
                Ask any questions about content creation, marketing strategies, or get detailed assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChatInterface />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="create">
          <ContentCreator />
        </TabsContent>
        
        <TabsContent value="strategy">
          <ContentStrategy />
        </TabsContent>
        
        <TabsContent value="library">
          <SavedContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SageBot;
