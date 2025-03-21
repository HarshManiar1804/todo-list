import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import type { Todo, User, Priority } from "@/lib/types";

interface CreateTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (todo: Omit<Todo, "_id" | "createdAt">) => void;
  users: User[];
  currentUser: User;
}

export default function CreateTodoModal({
  isOpen,
  onClose,
  onSubmit,
  users,
  currentUser,
}: CreateTodoModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [assignedUsers, setAssignedUsers] = useState<string[]>([]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleToggleAssignedUser = (userId: string) => {
    setAssignedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    const newTodo: Omit<Todo, "_id" | "createdAt"> = {
      title,
      description,
      priority,
      tags,
      assignedUsers: users.filter((user) => assignedUsers.includes(user._id)),
      notes: [],
      userId: currentUser._id,
      user: undefined,
      a: undefined,
      b: undefined
    };

    onSubmit(newTodo);

    // Reset form
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setTags([]);
    setAssignedUsers([]);
    setTagInput("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Todo</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter todo title"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter todo description"
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(value: Priority) => setPriority(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" onClick={handleAddTag} variant="secondary">
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="flex items-center gap-1">
                    {tag}
                    <button
                      className="ml-1 rounded-full hover:bg-muted p-1"
                      onClick={() => handleRemoveTag(tag)}
                      type="button"
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Assign Users</Label>
            <div className="grid grid-cols-2 gap-2">
              {users.map((user) => (
                <div
                  key={user._id}
                  className={`p-2 border rounded-md cursor-pointer flex items-center gap-2 ${assignedUsers.includes(user._id) ? "bg-primary/10 border-primary" : ""
                    }`}
                  onClick={() => handleToggleAssignedUser(user._id)}
                >
                  <div className="w-6 h-6 rounded-full bg-muted-foreground flex items-center justify-center text-background text-xs">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm">@{user.username}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Todo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
