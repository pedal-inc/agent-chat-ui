import { CheckCircle, Clock, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { MarkdownText } from "../markdown-text";

interface Todo {
  id: string;
  description: string;
  completed: boolean;
  result: string | object | null;
}

interface TaskProgressProps {
  todos: Todo[];
  className?: string;
}

function formatResult(result: string | object | null): string {
  if (!result) return "";
  if (typeof result === "string") return result;
  if (typeof result === "object") {
    try {
      return JSON.stringify(result, null, 2);
    } catch (error) {
      return String(result);
    }
  }
  return String(result);
}

export function TaskProgress({ todos, className }: TaskProgressProps) {
  if (!todos || todos.length === 0) return null;

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border bg-gray-50 p-4",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Task Progress</h3>
        <span className="text-sm text-gray-600">
          {completedCount}/{totalCount} completed
        </span>
      </div>

      <div className="space-y-3">
        {todos.map((todo, index) => (
          <div
            key={todo.id}
            className="flex gap-3"
          >
            <div className="mt-1 flex-shrink-0">
              {todo.completed ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : index === completedCount ? (
                <Clock className="h-5 w-5 animate-pulse text-blue-600" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "text-sm font-medium",
                  todo.completed ? "text-green-800" : "text-gray-700",
                )}
              >
                {todo.description}
              </p>

              {todo.completed && todo.result && (
                <div className="mt-2 rounded border-l-4 border-green-500 bg-white p-3">
                  <div className="text-sm text-gray-700">
                    <MarkdownText>{formatResult(todo.result)}</MarkdownText>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {completedCount < totalCount && (
        <div className="mt-2">
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
