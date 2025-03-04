
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  Copy, 
  UserPlus, 
  Mail, 
  Link, 
  Check, 
  Users,
  Share
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function InviteMembers() {
  const [email, setEmail] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const generateInviteLink = () => {
    // In a real app, you would generate a secure invitation token
    // For now, we'll just create a simple link with a random ID
    const inviteId = Math.random().toString(36).substring(2, 15);
    const link = `${window.location.origin}/collaboration?invite=${inviteId}&from=${user?.id}`;
    setInviteLink(link);
    setLinkCopied(false);
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setLinkCopied(true);
    toast({
      title: "Link copied!",
      description: "Share it with your team members",
      variant: "success",
    });

    // Reset the copied state after 3 seconds
    setTimeout(() => setLinkCopied(false), 3000);
  };

  const sendEmailInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter a valid email",
        variant: "destructive",
      });
      return;
    }

    // In a real application, you would send this via a backend service
    // For this demo, we'll just simulate sending an invite
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setInviteSent(true);
      toast({
        title: "Invitation sent!",
        description: `Invitation sent to ${email}`,
        variant: "success",
      });
      
      setEmail("");
      
      // Reset the sent state after 3 seconds
      setTimeout(() => setInviteSent(false), 3000);
      
    } catch (error) {
      console.error("Error sending invite:", error);
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <UserPlus className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Invite Team Members</h3>
            <p className="text-muted-foreground">Collaborate in real-time with your team</p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Email Invitation */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" /> Invite via Email
            </h4>
            
            <form onSubmit={sendEmailInvite} className="space-y-4">
              <Input
                type="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={!email.trim() || inviteSent}
              >
                {inviteSent ? (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Invitation Sent
                  </>
                ) : (
                  "Send Invitation"
                )}
              </Button>
            </form>
          </div>

          {/* Invite Link */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Link className="h-4 w-4" /> Invite via Link
            </h4>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={inviteLink}
                  placeholder="Generate a link to share"
                  className="flex-1"
                />
                
                {inviteLink ? (
                  <Button 
                    onClick={copyLinkToClipboard}
                    variant="outline"
                    size="icon"
                  >
                    {linkCopied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                ) : null}
              </div>
              
              <Button 
                onClick={generateInviteLink} 
                variant="outline" 
                className="w-full"
              >
                <Share className="mr-2 h-4 w-4" />
                Generate Invite Link
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Active Collaborators */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Active Collaborators</h3>
            <p className="text-muted-foreground">People currently working in this project</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {/* This would typically be populated with real user data */}
          <div className="flex items-center gap-3 bg-muted p-2 rounded-lg">
            <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-white text-sm font-medium">YS</span>
            </div>
            <div>
              <p className="text-sm font-medium">You</p>
              <p className="text-xs text-muted-foreground">Owner</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
