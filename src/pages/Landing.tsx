import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Zap, Users, Brain, BarChart, Upload, Bot, ListChecks, Gauge, Share2, MessageCircle, Send, Stars, Sparkles, Lightbulb } from "lucide-react";
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

  return <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-purple-800 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-32 h-32 rounded-full bg-purple-500/20 blur-3xl spinning"></div>
        <div className="absolute top-[40%] right-[10%] w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl floating"></div>
        <div className="absolute bottom-[20%] left-[15%] w-48 h-48 rounded-full bg-violet-500/15 blur-3xl spinning" style={{ animationDuration: '20s' }}></div>
        
        <div className="absolute top-[15%] right-[20%] text-yellow-300/80 pulse-glow">
          <Sparkles size={24} />
        </div>
        <div className="absolute top-[35%] left-[25%] text-yellow-200/80 pulse-glow" style={{ animationDelay: '1s' }}>
          <Stars size={20} />
        </div>
        <div className="absolute bottom-[40%] right-[30%] text-yellow-300/80 pulse-glow" style={{ animationDelay: '2s' }}>
          <Sparkles size={16} />
        </div>
        <div className="absolute bottom-[15%] left-[40%] text-yellow-200/80 pulse-glow" style={{ animationDelay: '1.5s' }}>
          <Stars size={18} />
        </div>
      </div>

      <div className="container mx-auto px-4 pt-20 pb-16 relative z-10">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2 floating" style={{ animationDuration: '4s' }}>
            <Zap className="w-8 h-8 text-white" />
            <span className="text-xl font-semibold text-white">SyncSage</span>
          </div>
          <Link to="/dashboard">
            <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">Sign In</Button>
          </Link>
        </nav>

        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-semibold mb-6 text-white animate-slide-up opacity-0" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
            Your Superhuman content creation Buddy 
          </h1>
          <p className="text-xl text-gray-200 mb-8 animate-fade-up opacity-0" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
            AI-powered tools to help content creators and teams collaborate, create, and grow their audience faster.
          </p>
          <div className="flex gap-4 justify-center mb-16 animate-fade-in opacity-0" style={{ animationDelay: "600ms", animationFillMode: "forwards" }}>
            <Link to="/dashboard">
              <Button size="lg" animated className="bg-white text-purple-700 hover:bg-white/90 gap-2 shadow-lg hover:shadow-xl hover:shadow-white/20 transition-all">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" animated className="border-white/20 text-white bg-white/10 hover:bg-white/20 px-[46px] text-base" onClick={handleVideoDemoClick}>
              Watch Demo
            </Button>
          </div>

          <div className="max-w-2xl mx-auto bg-white/5 rounded-xl p-8 border border-white/10 mb-16 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-24 h-24 text-indigo-200/30 spinning" style={{ animationDuration: '30s' }}>
              <Lightbulb size={96} />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-6 animate-slide-up opacity-0" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>Try Our AI Assistant</h2>
            <ChatInterface />
          </div>

          <div className="max-w-2xl mx-auto bg-white/5 rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6 animate-slide-up opacity-0" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>Leave Your Thoughts</h2>
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your feedback or suggestions..." className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              <Button type="submit" animated className="bg-purple-600 hover:bg-purple-700 text-white gap-2" disabled={!comment.trim()}>
                Submit <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <h2 className="text-3xl font-semibold text-center mb-12 text-white animate-slide-up opacity-0" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>Everything You Need to Create Better Content</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-white/10 border-white/20 hover:bg-white/15 hover:-translate-y-1">
            <Gauge className="w-12 h-12 text-white mb-4 floating" style={{ animationDuration: '3s', animationDelay: '0.1s' }} />
            <h3 className="text-xl font-semibold mb-2 text-white">Integrated Workflow</h3>
            <p className="text-gray-300">
              All-in-one dashboard for content generation, editing, team collaboration, and analytics. Upload to multiple platforms with one click.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-white/10 border-white/20 hover:bg-white/15 hover:-translate-y-1">
            <Brain className="w-12 h-12 text-white mb-4 floating" style={{ animationDuration: '3.5s', animationDelay: '0.2s' }} />
            <h3 className="text-xl font-semibold mb-2 text-white">Advanced AI Automation</h3>
            <p className="text-gray-300">
              Auto-generate shorts, extract key moments, create captions, and get AI-powered hashtag suggestions.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-white/10 border-white/20 hover:bg-white/15 hover:-translate-y-1">
            <Users className="w-12 h-12 text-white mb-4 floating" style={{ animationDuration: '3.2s', animationDelay: '0.3s' }} />
            <h3 className="text-xl font-semibold mb-2 text-white">Team Collaboration</h3>
            <p className="text-gray-300">
              Real-time editing, team chat, feedback system, and streamlined approval workflows.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-white/10 border-white/20 hover:bg-white/15 hover:-translate-y-1">
            <Zap className="w-12 h-12 text-white mb-4 floating" style={{ animationDuration: '3.3s', animationDelay: '0.4s' }} />
            <h3 className="text-xl font-semibold mb-2 text-white">Mind-Relaxation</h3>
            <p className="text-gray-300">
              Built-in binaural beats, nature sounds, and smart break reminders for creative well-being.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-white/10 border-white/20 hover:bg-white/15 hover:-translate-y-1">
            <Bot className="w-12 h-12 text-white mb-4 floating" style={{ animationDuration: '3.4s', animationDelay: '0.5s' }} />
            <h3 className="text-xl font-semibold mb-2 text-white">Sage Bot</h3>
            <p className="text-gray-300">
              Smart assistant that helps locate and share media files from your folders in real-time.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-white/10 border-white/20 hover:bg-white/15 hover:-translate-y-1">
            <Share2 className="w-12 h-12 text-white mb-4 floating" style={{ animationDuration: '3.5s', animationDelay: '0.6s' }} />
            <h3 className="text-xl font-semibold mb-2 text-white">Saved Environment</h3>
            <p className="text-gray-300">
              Organize and save ideas, posts, and content from any platform through our browser extension.
            </p>
          </Card>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/10 rounded-xl p-8 border border-white/20">
            <ListChecks className="w-12 h-12 text-white mb-4 floating" style={{ animationDuration: '3.6

