import { useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Todo, Note } from "@/lib/types";

interface TodoNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  todo: Todo;
  onNoteAdded?: (updatedTodo: Todo) => void;
}

export default function TodoNotesModal({ isOpen, onClose, todo, onNoteAdded }: TodoNotesModalProps) {
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<Note[]>(todo.notes || []);

  const handleAddNote = async () => {
    const content = newNote.trim();
    if (!content) return;

    setLoading(true);
    try {
      const res = await axios.post(`/api/todos/${todo._id}/notes`, { content });
      const updatedTodo: Todo = res.data.todo;

      setNotes(updatedTodo.notes || []);
      setNewNote("");

      if (onNoteAdded) onNoteAdded(updatedTodo);
    } catch (err) {
      console.error("Failed to add note:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Notes for "{todo.title}"</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {notes.length > 0 ? (
            <ScrollArea className="h-[200px] rounded-md border p-4">
              <div className="space-y-4">
                {notes.map((note) => (
                  <div key={note._id || note.createdAt} className="border-b pb-3 last:border-0 last:pb-0">
                    <p className="text-sm mb-1">{note.content}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(note.createdAt)}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center p-4 text-muted-foreground">
              No notes yet. Add your first note below.
            </div>
          )}

          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a new note..."
            rows={3}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Close
          </Button>
          <Button onClick={handleAddNote} disabled={loading || !newNote.trim()}>
            {loading ? "Adding..." : "Add Note"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
