
import { KanbanBoard } from "@/components/Kanban/KanbanBoard";
import { 
  Bot, 
  Users, 
  Brain, 
  Archive, 
  ListTodo, 
  Activity,
  CheckSquare,
  Clock,
  Milestone,
  Calendar,
  LineChart,
  BarChart,
  Instagram,
  Twitter,
  Facebook
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, trend, color = "primary" }: { 
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: { value: string; positive: boolean };
  color?: "primary" | "success" | "warning" | "danger" | "info";
}) => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-green-100 text-green-600",
    warning: "bg-amber-100 text-amber-600",
    danger: "bg-red-100 text-red-600",
    info: "bg-blue-100 text-blue-600"
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {trend && (
              <p className={`text-xs mt-1 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.positive ? '↑' : '↓'} {trend.value} since last week
              </p>
            )}
          </div>
          <div className={`p-2 rounded-full ${colorClasses[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TaskItem = ({ title, status, dueDate }: { title: string; status: "pending" | "completed" | "upcoming"; dueDate: string }) => {
  const statusStyles = {
    pending: "bg-amber-100 text-amber-600",
    completed: "bg-green-100 text-green-600",
    upcoming: "bg-blue-100 text-blue-600"
  };
  
  const statusIcons = {
    pending: <Clock className="w-4 h-4" />,
    completed: <CheckSquare className="w-4 h-4" />,
    upcoming: <Calendar className="w-4 h-4" />
  };
  
  return (
    <div className="flex items-center justify-between p-3 border-b last:border-0">
      <div className="flex items-center gap-3">
        <div className={`p-1.5 rounded-full ${statusStyles[status]}`}>
          {statusIcons[status]}
        </div>
        <span className="font-medium">{title}</span>
      </div>
      <span className="text-sm text-gray-500">{dueDate}</span>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Content Creation Dashboard</h1>
      
      {/* User Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Active Users" 
          value="1,293" 
          icon={Users} 
          trend={{ value: "12%", positive: true }} 
        />
        <StatCard 
          title="Engagement Rate" 
          value="24.8%" 
          icon={Activity} 
          trend={{ value: "4%", positive: true }} 
          color="success"
        />
        <StatCard 
          title="Recent Activity" 
          value="87 Actions" 
          icon={Clock} 
          trend={{ value: "3%", positive: false }} 
          color="info"
        />
      </div>
      
      {/* Quick Access Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-primary" />
              Task Summary
            </CardTitle>
            <CardDescription>Overview of your content creation tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <TaskItem title="Create Instagram Reels" status="pending" dueDate="Today" />
              <TaskItem title="Edit YouTube Video" status="completed" dueDate="Yesterday" />
              <TaskItem title="Design Pinterest Graphics" status="upcoming" dueDate="Tomorrow" />
              <TaskItem title="Write Blog Post" status="pending" dueDate="Jun 22" />
            </div>
            <Button asChild variant="outline" className="w-full mt-4">
              <Link to="/tasks">View All Tasks</Link>
            </Button>
          </CardContent>
        </Card>
        
        {/* AI Assistant Quick Access */}
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              SageBot AI Assistant
            </CardTitle>
            <CardDescription>Your AI-powered content creation assistant</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-4 rounded-lg border mb-4">
              <p className="text-sm text-gray-600 italic">
                "Need help with content ideas or caption writing? Ask me anything about your content strategy!"
              </p>
            </div>
            <div className="flex space-x-2">
              <Button asChild className="flex-1" variant="outline">
                <Link to="/sage-bot">Generate Content</Link>
              </Button>
              <Button asChild>
                <Link to="/sage-bot">
                  Chat with SageBot
                  <Bot className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Project Progress & Social Media Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Progress Tracker */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Milestone className="w-5 h-5 text-primary" />
              Project Progress
            </CardTitle>
            <CardDescription>Track your content creation milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Q2 Content Calendar</span>
                  <span className="text-sm font-medium">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">YouTube Series</span>
                  <span className="text-sm font-medium">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "45%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Instagram Campaign</span>
                  <span className="text-sm font-medium">90%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "90%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Social Media Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-primary" />
              Social Media Performance
            </CardTitle>
            <CardDescription>Your audience growth and engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Twitter className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">Twitter</span>
                </div>
                <div className="text-right">
                  <p className="font-bold">+327</p>
                  <p className="text-xs text-green-600">↑ 12% followers</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-pink-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Instagram className="w-5 h-5 text-pink-500" />
                  <span className="font-medium">Instagram</span>
                </div>
                <div className="text-right">
                  <p className="font-bold">+1,204</p>
                  <p className="text-xs text-green-600">↑ 18% followers</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Facebook className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Facebook</span>
                </div>
                <div className="text-right">
                  <p className="font-bold">+562</p>
                  <p className="text-xs text-green-600">↑ 7% followers</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Kanban Board */}
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
