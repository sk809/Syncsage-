
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
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const { toast } = useToast();

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
            const newStatus = over.id as Task["status"];
            // If the task is moved to "done", remove it after 2 seconds
            if (newStatus === "done") {
              setTimeout(() => {
                setTasks((currentTasks) =>
                  currentTasks.filter((ct) => ct.id !== t.id)
                );
                toast({
                  title: "Task Completed! 🎉",
                  description: `${t.title} has been marked as done and removed.`,
                });
              }, 2000);
            }
            return {
              ...t,
              status: newStatus,
            };
          }
          return t;
        });

        return updatedTasks;
      });
    }
    setActiveId(null);
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a task title",
      });
      return;
    }

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      description: "New task description",
      status: "backlog",
      priority: "medium",
      labels: ["New"],
      assignee: "You",
      dueDate: new Date().toISOString().split('T')[0],
    };

    setTasks((prev) => [...prev, newTask]);
    setNewTaskTitle("");
    toast({
      title: "Task Added",
      description: "New task has been added to the backlog.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <Input
          type="text"
          placeholder="Enter new task title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="max-w-md"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleAddTask();
            }
          }}
        />
        <Button onClick={handleAddTask} className="whitespace-nowrap">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

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
    </div>
  );
};
