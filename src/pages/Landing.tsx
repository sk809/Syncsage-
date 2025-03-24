import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Zap, Brain, Bot, ListChecks, Gauge, Share2, MessageCircle, Send, Upload, BarChart } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChatInterface } from "@/components/Chat/ChatInterface";
import { UploadButton } from "@/components/Library/UploadButton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

const Landing = () => {
  const [comment, setComment] = useState("");
  const [demoVideoUrl, setDemoVideoUrl] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      toast({
        title: "Thank you for your feedback!",
        description: "Your thoughts have been submitted successfully."
      });
      setComment("");
    }
  };

  const handleVideoDemoClick = () => {
    const checkForDemoVideo = async () => {
      try {
        const { data, error } = await supabase
          .from('media_files')
          .select('*')
          .eq('filename', 'app_demo.mp4')
          .order('created_at', { ascending: false })
          .limit(1);

        if (!error && data && data.length > 0) {
          const videoUrl = supabase.storage.from('media').getPublicUrl(data[0].file_path).data.publicUrl;
          setDemoVideoUrl(videoUrl);
          setIsDialogOpen(true);
        } else {
          setDemoVideoUrl(null);
          setIsDialogOpen(true);
        }
      } catch (error) {
        console.error("Error fetching demo video:", error);
        setIsDialogOpen(true);
      }
    };

    checkForDemoVideo();
  };

  const handleUploadComplete = (videoUrl: string) => {
    setDemoVideoUrl(videoUrl);
    toast({
      title: "Demo video updated",
      description: "Your demo video has been successfully uploaded and is now available for viewing."
    });
  };

  return <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 pt-20 pb-16">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-white" />
            <span className="text-xl font-semibold text-white">SyncSage</span>
          </div>
          <Link to="/dashboard">
            <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm">Sign In</Button>
          </Link>
        </nav>

        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-3">
            <div className="flex items-center gap-2 px-4 py-1 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 animate-fade-in opacity-0" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
              <span className="text-white font-semibold">#1 Content Repurpose App</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-semibold mb-6 text-white animate-slide-up opacity-0 drop-shadow-lg" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
            Your Superhuman Content Creation Buddy
          </h1>
          <p className="text-xl text-gray-200 mb-8 animate-fade-up opacity-0" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
            Ease your creator life with our AI powered content generation and management
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in opacity-0" style={{ animationDelay: "600ms", animationFillMode: "forwards" }}>
            <Link to="/dashboard">
              <Button size="lg" animated className="bg-white text-purple-700 hover:bg-white/90 gap-2 shadow-lg w-full sm:w-auto">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" animated className="border-white/20 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm w-full sm:w-auto" onClick={handleVideoDemoClick}>
              Watch Demo
            </Button>
          </div>

          <div className="max-w-2xl mx-auto bg-white/10 rounded-xl p-8 border border-white/20 mb-16 shadow-xl backdrop-blur-sm">
            <h2 className="text-2xl font-semibold text-white mb-6 animate-slide-up opacity-0" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>Try Our AI Assistant</h2>
            <ChatInterface />
          </div>

          <div className="max-w-2xl mx-auto bg-white/10 rounded-xl p-8 border border-white/20 shadow-xl backdrop-blur-sm mt-40">
            <h2 className="text-2xl font-semibold text-white mb-6 animate-slide-up opacity-0" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>Leave Your Thoughts</h2>
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your feedback or suggestions..." className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              <Button type="submit" animated className="bg-purple-600 hover:bg-purple-700 text-white gap-2 shadow-md" disabled={!comment.trim()}>
                Submit <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-semibold text-center mb-12 text-white animate-slide-up opacity-0 drop-shadow-lg" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>Everything You Need to Create Better Content</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="p-6 hover:shadow-xl transition-all duration-300 bg-white/10 border-white/20 backdrop-blur-sm transform hover:scale-105">
            <Gauge className="w-12 h-12 text-white mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Integrated Workflow</h3>
            <p className="text-gray-300">
              All-in-one dashboard for content generation, editing, and analytics. Upload to multiple platforms with one click.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-all duration-300 bg-white/10 border-white/20 backdrop-blur-sm transform hover:scale-105">
            <Brain className="w-12 h-12 text-white mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Advanced AI Automation</h3>
            <p className="text-gray-300">
              Auto-generate shorts, extract key moments, create captions, and get AI-powered hashtag suggestions.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-all duration-300 bg-white/10 border-white/20 backdrop-blur-sm transform hover:scale-105">
            <Bot className="w-12 h-12 text-white mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Sage Bot</h3>
            <p className="text-gray-300">
              Smart assistant that helps locate and share media files from your folders in real-time.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-all duration-300 bg-white/10 border-white/20 backdrop-blur-sm transform hover:scale-105">
            <Share2 className="w-12 h-12 text-white mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Saved Environment</h3>
            <p className="text-gray-300">
              Organize and save ideas, posts, and content from any platform through our browser extension.
            </p>
          </Card>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/10 rounded-xl p-8 border border-white/20 shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <ListChecks className="w-12 h-12 text-white mb-4" />
            <h3 className="text-2xl font-semibold mb-4 text-white animate-slide-up opacity-0" style={{ animationDelay: "250ms", animationFillMode: "forwards" }}>Smart Task Management</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Track content ideas and upcoming projects
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Monitor content status (draft, published)
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Schedule project deadlines
              </li>
            </ul>
          </div>

          <div className="bg-white/10 rounded-xl p-8 border border-white/20 shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <BarChart className="w-12 h-12 text-white mb-4" />
            <h3 className="text-2xl font-semibold mb-4 text-white animate-slide-up opacity-0" style={{ animationDelay: "250ms", animationFillMode: "forwards" }}>Analytics & Insights</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Track content performance metrics
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Audience growth and engagement analysis
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                AI-driven content recommendations
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-purple-900/30 rounded-xl p-8 border border-purple-500/20 shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300 animate-fade-in opacity-0" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
            <p className="text-lg text-white mb-6">
              "SyncSage is insane. I sat down for 15min and created 10+ reels scripts for like the next two weeks and they are fckin good"
            </p>
            <div className="flex items-center gap-4">
              <img 
                src="https://randomuser.me/api/portraits/men/32.jpg" 
                alt="Jordan Moss" 
                className="w-12 h-12 rounded-full object-cover border-2 border-purple-400"
              />
              <div>
                <h4 className="text-purple-400 font-semibold">Jordan Moss</h4>
                <p className="text-gray-400 text-sm">@jmoss_mentality</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-900/30 rounded-xl p-8 border border-purple-500/20 shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300 animate-fade-in opacity-0" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
            <p className="text-lg text-white mb-6">
              "I am dead serious when I tell you that this is going to change the content creation game forever."
            </p>
            <div className="flex items-center gap-4">
              <img 
                src="https://randomuser.me/api/portraits/men/53.jpg" 
                alt="Blake Rocha" 
                className="w-12 h-12 rounded-full object-cover border-2 border-purple-400"
              />
              <div>
                <h4 className="text-purple-400 font-semibold">Blake Rocha</h4>
                <p className="text-gray-400 text-sm">@mrfourtoeight</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-900/30 rounded-xl p-8 border border-purple-500/20 shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300 animate-fade-in opacity-0" style={{ animationDelay: "600ms", animationFillMode: "forwards" }}>
            <p className="text-lg text-white mb-6">
              "This is the best AI social media writing tool I've ever seen"
            </p>
            <div className="flex items-center gap-4">
              <img 
                src="https://randomuser.me/api/portraits/men/72.jpg" 
                alt="Ryan Solomon" 
                className="w-12 h-12 rounded-full object-cover border-2 border-purple-400"
              />
              <div>
                <h4 className="text-purple-400 font-semibold">Ryan Solomon</h4>
                <p className="text-gray-400 text-sm">@sullydoestail</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white animate-slide-up opacity-0" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
            Let's Grow Your Social Media
          </h2>
          <p className="text-xl text-gray-300 mb-10 animate-fade-up opacity-0" style={{ animationDelay: "500ms", animationFillMode: "forwards" }}>
            You'll have access to exclusive discounts and early access to the platform.
          </p>
          <Link to="/dashboard">
            <Button 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-6 text-lg rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.5)] animate-pulse-subtle"
            >
              Get Started for FREE
            </Button>
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-white" />
              <span className="font-semibold text-white">Syncsage</span>
            </div>
            <p className="text-gray-300">© 2024 Syncsage All rights reserved.</p>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">App Demo Video</DialogTitle>
            <DialogDescription>
              {demoVideoUrl ? "Watch our app demo to see how SyncSage can supercharge your content creation workflow." : "Upload a demo video to showcase your app's features."}
            </DialogDescription>
          </DialogHeader>
          
          {demoVideoUrl ? (
            <div className="mt-4 aspect-video rounded-md overflow-hidden bg-black">
              <video 
                src={demoVideoUrl} 
                controls 
                className="w-full h-full object-contain" 
                poster="/placeholder.svg"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <p className="text-gray-500 mb-4">No demo video has been uploaded yet. Please upload one now:</p>
              <UploadButton 
                label="Upload Demo Video" 
                icon={<Upload className="mr-2 h-4 w-4" />}
                acceptTypes="video/*"
                buttonVariant="default"
                onUploadComplete={handleUploadComplete}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>;
};

export default Landing;
