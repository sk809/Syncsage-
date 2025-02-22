
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ArrowRight, 
  Zap, 
  Users, 
  Brain, 
  BarChart, 
  Upload, 
  Robot, 
  ListChecks,
  Gauge,
  Bot,
  Share2,
  MessageCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#8B5CF6] via-[#6E59A5] to-[#1A1F2C]">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-white" />
            <span className="text-xl font-semibold text-white">CreatorFlow</span>
          </div>
          <Link to="/dashboard">
            <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">Sign In</Button>
          </Link>
        </nav>

        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-semibold mb-6 text-white">
            Make content creation faster not harder
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            AI-powered tools to help content creators and teams collaborate, create, and grow their audience faster.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Watch Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-semibold text-center mb-12 text-white">Everything You Need to Create Better Content</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 hover:shadow-lg transition-shadow bg-white/10 border-white/20">
            <Gauge className="w-12 h-12 text-white mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Integrated Workflow</h3>
            <p className="text-gray-300">
              All-in-one dashboard for content generation, editing, team collaboration, and analytics. Upload to multiple platforms with one click.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow bg-white/10 border-white/20">
            <Brain className="w-12 h-12 text-white mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Advanced AI Automation</h3>
            <p className="text-gray-300">
              Auto-generate shorts, extract key moments, create captions, and get AI-powered hashtag suggestions.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow bg-white/10 border-white/20">
            <Users className="w-12 h-12 text-white mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Team Collaboration</h3>
            <p className="text-gray-300">
              Real-time editing, team chat, feedback system, and streamlined approval workflows.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow bg-white/10 border-white/20">
            <Zap className="w-12 h-12 text-white mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Mind-Relaxation</h3>
            <p className="text-gray-300">
              Built-in binaural beats, nature sounds, and smart break reminders for creative well-being.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow bg-white/10 border-white/20">
            <Bot className="w-12 h-12 text-white mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Sage Bot</h3>
            <p className="text-gray-300">
              Smart assistant that helps locate and share media files from your folders in real-time.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow bg-white/10 border-white/20">
            <Share2 className="w-12 h-12 text-white mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Saved Environment</h3>
            <p className="text-gray-300">
              Organize and save ideas, posts, and content from any platform through our browser extension.
            </p>
          </Card>
        </div>
      </div>

      {/* Additional Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/10 rounded-xl p-8 border border-white/20">
            <ListChecks className="w-12 h-12 text-white mb-4" />
            <h3 className="text-2xl font-semibold mb-4 text-white">Smart Task Management</h3>
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
                Schedule team meetings and deadlines
              </li>
            </ul>
          </div>

          <div className="bg-white/10 rounded-xl p-8 border border-white/20">
            <MessageCircle className="w-12 h-12 text-white mb-4" />
            <h3 className="text-2xl font-semibold mb-4 text-white">Seamless Communication</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Real-time team chat and collaboration
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Instant feedback on content
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Streamlined approval process
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-white" />
              <span className="font-semibold text-white">CreatorFlow</span>
            </div>
            <p className="text-gray-300">© 2024 CreatorFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
