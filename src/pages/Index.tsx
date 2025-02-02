import { useEffect } from "react";
import { DashboardCard } from "@/components/Dashboard/DashboardCard";
import { PerformanceChart } from "@/components/Dashboard/PerformanceChart";
import { TaskList } from "@/components/Dashboard/TaskList";
import { SoundPlayer } from "@/components/Relaxation/SoundPlayer";
import { Activity, Film, Users } from "lucide-react";

const Index = () => {
  useEffect(() => {
    // Load Inter font
    import("@fontsource/inter");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <h1 className="text-4xl font-medium mb-8">Welcome back, Creator!</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard title="Total Views" className="bg-gradient-to-br from-primary to-primary/80 text-white">
            <div className="flex items-center gap-4">
              <Activity className="h-8 w-8" />
              <div>
                <p className="text-3xl font-bold">24.5K</p>
                <p className="text-sm opacity-80">+12% from last week</p>
              </div>
            </div>
          </DashboardCard>
          
          <DashboardCard title="Videos Created" className="bg-white">
            <div className="flex items-center gap-4">
              <Film className="h-8 w-8 text-primary" />
              <div>
                <p className="text-3xl font-bold">12</p>
                <p className="text-sm text-gray-500">This month</p>
              </div>
            </div>
          </DashboardCard>
          
          <DashboardCard title="Followers" className="bg-white">
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-3xl font-bold">2.1K</p>
                <p className="text-sm text-gray-500">Across all platforms</p>
              </div>
            </div>
          </DashboardCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <DashboardCard title="Performance Overview">
              <PerformanceChart />
            </DashboardCard>
            
            <DashboardCard title="Upcoming Tasks">
              <TaskList />
            </DashboardCard>
          </div>
          
          <div className="lg:col-span-1">
            <DashboardCard title="Mind Relaxation">
              <SoundPlayer />
            </DashboardCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;