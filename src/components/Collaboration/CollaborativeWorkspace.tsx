import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Plus, 
  Home, 
  User, 
  BarChart4,
  Settings,
  Save,
  Undo,
  Redo
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Frame {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

export function CollaborativeWorkspace() {
  const [frames, setFrames] = useState<Frame[]>([
    { 
      id: "frame-1", 
      name: "Homepage", 
      icon: <Home className="h-4 w-4" />, 
      color: "bg-blue-500" 
    },
    { 
      id: "frame-2", 
      name: "Signup Page", 
      icon: <User className="h-4 w-4" />, 
      color: "bg-green-500" 
    },
    { 
      id: "frame-3", 
      name: "Dashboard UI", 
      icon: <BarChart4 className="h-4 w-4" />, 
      color: "bg-red-500" 
    },
  ]);
  
  const [activeFrame, setActiveFrame] = useState<string>("frame-1");
  const [editHistory, setEditHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const { toast } = useToast();

  const addNewFrame = () => {
    const newFrame: Frame = {
      id: `frame-${frames.length + 1}`,
      name: `New Frame ${frames.length + 1}`,
      icon: <LayoutDashboard className="h-4 w-4" />,
      color: "bg-purple-500"
    };
    
    setFrames([...frames, newFrame]);
    toast({
      title: "Frame created",
      description: `${newFrame.name} has been added to the workspace`,
    });
  };

  const simulateEdit = () => {
    // In a real app, this would track actual edits
    // For demo purposes, we'll just simulate adding edit history
    const newEdit = `Edit on ${new Date().toLocaleTimeString()} by You`;
    
    // If we're not at the latest point in history, truncate the future edits
    const newHistory = editHistory.slice(0, historyIndex + 1);
    newHistory.push(newEdit);
    
    setEditHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    toast({
      title: "Changes saved",
      description: "Your edits have been auto-saved",
    });
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      toast({
        title: "Undo",
        description: "Previous action undone",
      });
    }
  };

  const redo = () => {
    if (historyIndex < editHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      toast({
        title: "Redo",
        description: "Action restored",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <LayoutDashboard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Collaborative Workspace</h3>
              <p className="text-muted-foreground">Edit and organize your project frames</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={undo}
              disabled={historyIndex <= 0}
            >
              <Undo className="h-4 w-4 mr-1" /> Undo
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={redo}
              disabled={historyIndex >= editHistory.length - 1}
            >
              <Redo className="h-4 w-4 mr-1" /> Redo
            </Button>
            
            <Button 
              size="sm"
              onClick={simulateEdit}
            >
              <Save className="h-4 w-4 mr-1" /> Save Changes
            </Button>
          </div>
        </div>

        {/* Frames List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {frames.map((frame) => (
            <div 
              key={frame.id}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                activeFrame === frame.id 
                  ? "border-2 border-primary bg-primary/5" 
                  : "border border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setActiveFrame(frame.id)}
            >
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-md ${frame.color} flex items-center justify-center text-white`}>
                  {frame.icon}
                </div>
                <span className="font-medium">{frame.name}</span>
              </div>
            </div>
          ))}
          
          <div 
            className="p-4 rounded-lg border border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 cursor-pointer transition-all"
            onClick={addNewFrame}
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <Plus className="h-4 w-4" />
              <span>Add Frame</span>
            </div>
          </div>
        </div>

        {/* Frame Content */}
        <div className="border border-gray-200 rounded-lg p-4 h-64 bg-muted/30">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                {frames.find(f => f.id === activeFrame)?.name} Editor
              </p>
              <p className="text-xs text-muted-foreground">
                Multiple users can edit this workspace simultaneously
              </p>
              <div className="mt-4">
                <div className="inline-flex items-center gap-2 text-xs bg-primary/10 p-1 px-2 rounded">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>You are editing this frame</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Version History */}
        {editHistory.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Version History</h4>
            <div className="text-xs space-y-1">
              {editHistory.map((edit, index) => (
                <div 
                  key={index}
                  className={`p-2 rounded ${
                    index === historyIndex 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground"
                  }`}
                >
                  {edit}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
