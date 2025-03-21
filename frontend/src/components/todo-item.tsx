import { useState } from "react";
import axios from "axios";
import { Edit, Trash2, MessageSquare } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"; // ✅ Toast hook
import type { Todo, User } from "@/lib/types";
import EditTodoModal from "@/components/edit-todo-modal";
import TodoNotesModal from "@/components/todo-notes-modal";

interface TodoItemProps {
  todo: Todo;
  users: User[];
  currentUser: User;
  onUpdate: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({
  todo,
  users,
  currentUser,
  onUpdate,
  onDelete,
}: TodoItemProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const { toast } = useToast(); // ✅ Toast instance

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const creatorName =
    typeof todo.user === "object"
      ? todo.user.username
      : users.find((u) => u._id === todo.userId)?.username || "unknown";

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const handleUpdateTodo = async (updatedFields: Partial<Todo>) => {
    if (currentUser._id !== todo.user._id) {
      const ownerName = creatorName || "Unknown";
      toast({
        title: "Permission Denied",
        description: `Only @${ownerName} can update this todo.`,
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await axios.put(`/api/todos/${todo._id}`, {
        ...todo,
        ...updatedFields,
      });
      onUpdate(res.data);

      toast({
        title: "Todo Updated",
        description: `"${res.data.title}" was successfully updated.`,
      });
    } catch (error) {
      console.error("Failed to update todo:", error);
      toast({
        title: "Update Failed",
        description: "Something went wrong while updating the todo.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTodo = async () => {
    if (currentUser._id !== todo.user._id) {
      const ownerName = creatorName || "Unknown";
      toast({
        title: "Permission Denied",
        description: `Only @${ownerName} can delete this todo.`,
        variant: "destructive",
      });
      return;
    }

    try {
      await axios.delete(`/api/todos/${todo._id}`, {
        data: { userId: currentUser._id },
      });
      onDelete(todo._id);

      toast({
        title: "Todo Deleted",
        description: `"${todo.title}" was removed successfully.`,
      });
    } catch (error) {
      console.error("Failed to delete todo:", error);
      toast({
        title: "Deletion Failed",
        description: "Could not delete this todo.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <CardTitle>{todo.title}</CardTitle>
            <div className="flex gap-2">
              <Button
                className="cursor-pointer"
                variant="ghost"
                size="icon"
                onClick={() => setIsNotesModalOpen(true)}
                title="View Notes"
              >
                <MessageSquare size={18} />
              </Button>
              <Button
                className="cursor-pointer"
                variant="ghost"
                size="icon"
                onClick={() => setIsEditModalOpen(true)}
                title="Edit Todo"
              >
                <Edit size={18} />
              </Button>
              <Button
                className="cursor-pointer"
                variant="ghost"
                size="icon"
                onClick={handleDeleteTodo}
                title="Delete Todo"
              >
                <Trash2 size={18} />
              </Button>
            </div>
          </div>
          <CardDescription>
            Created by @{creatorName} on {formatDate(todo.createdAt)}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {todo.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-2">
            <Badge className={getPriorityColor(todo.priority)}>
              {todo.priority}
            </Badge>
            {todo.tags?.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          {Array.isArray(todo.assignedUsers) && todo.assignedUsers.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-1">Assigned Users:</p>
              <div className="flex flex-wrap gap-1">
                {todo.assignedUsers.map((user: any) => (
                  <Badge key={user._id} variant="secondary" className="text-xs">
                    @{user.username}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        {todo.notes && todo.notes.length > 0 && (
          <CardFooter className="pt-0">
            <Button
              variant="ghost"
              className="p-0 h-auto text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setIsNotesModalOpen(true)}
            >
              {todo.notes.length} note{todo.notes.length !== 1 ? "s" : ""}
            </Button>
          </CardFooter>
        )}
      </Card>

      <EditTodoModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={(updatedData) => {
          handleUpdateTodo(updatedData);
          setIsEditModalOpen(false);
        }}
        todo={todo}
        users={users}
      />

      <TodoNotesModal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        todo={todo}
        onNoteAdded={(updatedTodo) => onUpdate(updatedTodo)}
      />
    </>
  );
}
