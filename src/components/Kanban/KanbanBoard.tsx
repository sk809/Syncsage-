
import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { Card } from "@/components/ui/card";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "backlog" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  assignee?: string;
  dueDate?: string;
  labels: string[];
}

const defaultColumns = [
  {
    id: "backlog",
    title: "Ideas & Inspiration",
    color: "bg-gray-500",
  },
  {
    id: "in_progress",
    title: "Content Planning & Drafting",
    color: "bg-blue-500",
  },
  {
    id: "review",
    title: "Editing & Review",
    color: "bg-yellow-500",
  },
  {
    id: "done",
    title: "Published",
    color: "bg-green-500",
  },
];

export const KanbanBoard = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Write SEO Blog Post",
      description: "Create a blog post about AI in content creation",
      status: "backlog",
      priority: "high",
      assignee: "Alex",
      dueDate: "2024-03-05",
      labels: ["Blog", "SEO", "Content"],
    },
    // Add more sample tasks as needed
  ]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setTasks((tasks) => {
        const task = tasks.find((t) => t.id === active.id);
        if (!task) return tasks;

        const updatedTasks = tasks.map((t) => {
          if (t.id === active.id) {
            return {
              ...t,
              status: over.id as Task["status"],
            };
          }
          return t;
        });

        return updatedTasks;
      });
    }
    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 h-full overflow-x-auto p-4">
        {defaultColumns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            color={column.color}
            tasks={tasks.filter((task) => task.status === column.id)}
          />
        ))}
      </div>
      <DragOverlay>
        {activeId ? (
          <Card className="w-[300px] shadow-lg">
            <KanbanCard
              task={tasks.find((task) => task.id === activeId)!}
              overlay
            />
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
