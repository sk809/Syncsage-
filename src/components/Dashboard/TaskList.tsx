import { Check, Clock } from "lucide-react";

const tasks = [
  { id: 1, title: "Edit weekly vlog", status: "pending" },
  { id: 2, title: "Create thumbnail for latest video", status: "completed" },
  { id: 3, title: "Schedule Instagram posts", status: "pending" },
  { id: 4, title: "Record podcast episode", status: "pending" },
];

export const TaskList = () => {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg border hover:border-primary transition-colors"
        >
          <div className="flex items-center gap-3">
            {task.status === "completed" ? (
              <Check className="text-success" />
            ) : (
              <Clock className="text-primary" />
            )}
            <span className={task.status === "completed" ? "line-through text-gray-500" : ""}>
              {task.title}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};