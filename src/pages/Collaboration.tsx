
import { TeamChat } from "@/components/Chat/TeamChat";
import { InviteMembers } from "@/components/Collaboration/InviteMembers";
import { CollaborativeWorkspace } from "@/components/Collaboration/CollaborativeWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Collaboration() {
  return (
    <div className="container py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 animate-slide-up">Collaboration Hub</h1>
        <p className="text-muted-foreground mb-8 animate-fade-up">
          Work together with your team in real-time
        </p>
        
        <Tabs defaultValue="chat" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="chat">Team Chat</TabsTrigger>
            <TabsTrigger value="workspace">Workspace</TabsTrigger>
            <TabsTrigger value="invite">Invite Members</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat">
            <TeamChat />
          </TabsContent>
          
          <TabsContent value="workspace">
            <CollaborativeWorkspace />
          </TabsContent>
          
          <TabsContent value="invite">
            <InviteMembers />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
