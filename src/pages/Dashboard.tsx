import { KanbanBoard } from "@/components/Kanban/KanbanBoard";

const Dashboard = () => {
  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Content Creation Dashboard</h1>
      <div className="h-[calc(100vh-12rem)]">
        <KanbanBoard />
      </div>
    </div>
  );
};

export default Dashboard;
