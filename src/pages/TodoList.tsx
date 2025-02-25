
import { KanbanBoard } from "@/components/Kanban/KanbanBoard";

const TodoList = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
        <p className="text-gray-600">Organize and track your content creation tasks</p>
      </div>
      <KanbanBoard />
    </div>
  );
};

export default TodoList;
