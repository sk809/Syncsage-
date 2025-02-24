
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Tag, AlertCircle } from "lucide-react";
import type { Task } from "./KanbanBoard";

interface KanbanCardProps {
  task: Task;
  overlay?: boolean;
}

export const KanbanCard = ({ task, overlay }: KanbanCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: task,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const card = (
    <Card className={`${overlay ? "" : "hover:shadow-md transition-shadow"}`}>
      <CardHeader className="p-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          {task.title}
          <AlertCircle
            className={`w-4 h-4 ${getPriorityColor(task.priority)}`}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-2">
        <p className="text-sm text-gray-500 line-clamp-2">{task.description}</p>
        {task.dueDate && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <CalendarDays className="w-3 h-3" />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}
        {task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.labels.map((label) => (
              <div
                key={label}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-xs"
              >
                <Tag className="w-3 h-3" />
                {label}
              </div>
            ))}
          </div>
        )}
        {task.assignee && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
              {task.assignee[0]}
            </div>
            <span className="text-xs text-gray-500">{task.assignee}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (overlay) {
    return card;
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="cursor-grab active:cursor-grabbing"
    >
      {card}
    </div>
  );
};
