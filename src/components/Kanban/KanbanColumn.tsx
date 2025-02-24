
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanCard } from "./KanbanCard";
import type { Task } from "./KanbanBoard";

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
}

export const KanbanColumn = ({ id, title, tasks, color }: KanbanColumnProps) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex flex-col gap-4 min-w-[300px]">
      <div className={`p-2 rounded-t-lg ${color}`}>
        <h3 className="font-semibold text-white px-2">{title}</h3>
      </div>
      <div
        ref={setNodeRef}
        className="flex flex-col gap-2 p-2 bg-gray-50 rounded-lg min-h-[200px]"
      >
        <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};
