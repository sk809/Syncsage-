
import { KanbanBoard } from "@/components/Kanban/KanbanBoard";
import { Bot, Users, Brain, Robot, Archive, ListTodo } from "lucide-react";

const DashboardSection = ({ 
  id, 
  title, 
  description, 
  icon: Icon, 
  children 
}: { 
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  children?: React.ReactNode;
}) => (
  <section id={id} className="min-w-[300px] bg-white p-6 rounded-lg shadow-sm border flex-shrink-0">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 rounded-lg bg-primary/10">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
    </div>
    <p className="text-gray-600 mb-4">{description}</p>
    {children}
  </section>
);

const Dashboard = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Content Creation Dashboard</h1>
      
      <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4">
        <DashboardSection
          id="ai-automation"
          title="Advanced AI Automation"
          description="Our platform uses state-of-the-art AI to automate content repurposing, auto-captioning, and more—saving you time and boosting productivity."
          icon={Robot}
        />
        
        <DashboardSection
          id="team-collaboration"
          title="Real-Time Team Collaboration"
          description="Collaborate seamlessly with live editing, task assignments, and approval workflows to keep your team in sync."
          icon={Users}
        />
        
        <DashboardSection
          id="mind-relaxation"
          title="Mind-Relaxation Tools"
          description="Integrated audio cues and smart break reminders help reduce burnout and keep creativity flowing during long sessions."
          icon={Brain}
        />
        
        <DashboardSection
          id="sage-bot"
          title="Sage Bot"
          description="Quickly retrieve and share raw media from your folders using our intelligent Sage Bot to streamline your creative process."
          icon={Bot}
        />
        
        <DashboardSection
          id="saved-environment"
          title="Saved Environment"
          description="Organize ideas, posts, reels, hashtags, and more from all platforms into one accessible library for future reference."
          icon={Archive}
        />
      </div>

      <DashboardSection
        id="advanced-todo"
        title="Advanced To-Do List"
        description="Manage your entire content creation workflow with our interactive to-do list that tracks tasks from ideation to publication."
        icon={ListTodo}
      >
        <div className="h-[calc(100vh-20rem)] mt-6 -mx-6 px-6">
          <KanbanBoard />
        </div>
      </DashboardSection>
    </div>
  );
};

export default Dashboard;
