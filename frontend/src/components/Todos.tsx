// Todos.tsx
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Todo {
    title: string;
    description: string;
    priority: string;
    tag: string;
    taggedPerson: string;
}

const Todos = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState<Todo>({
        title: "",
        description: "",
        priority: "",
        tag: "",
        taggedPerson: "",
    });

    const handleAddTodo = () => {
        if (!newTodo.title || !newTodo.description) return;
        setTodos([...todos, newTodo]);
        setNewTodo({ title: "", description: "", priority: "", tag: "", taggedPerson: "" });
    };

    return (
        <div className="flex justify-between p-8 gap-6">
            {/* Section 1 - Todo List */}
            <Card className="w-3/4 h-[600px] overflow-auto border text-white">
                <CardContent className="p-6 space-y-4">
                    <h2 className="text-2xl font-semibold">Todo List</h2>
                    {todos.length === 0 ? (
                        <p className="text-zinc-500">No tasks added yet.</p>
                    ) : (
                        todos.map((todo, index) => (
                            <Card key={index} className="border rounded-xl shadow-sm">
                                <CardContent className="p-4 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-lg font-medium">{todo.title}</div>
                                            <p className="text-sm text-zinc-400 mt-1">{todo.description}</p>
                                            <p className="text-xs mt-2 text-zinc-400">Priority: {todo.priority}</p>
                                            <p className="text-xs text-zinc-400">Tag: {todo.tag}</p>
                                        </div>
                                        <div className="text-xs bg-zinc-400 px-3 py-1 rounded-full border border-zinc-600">
                                            Tagged: {todo.taggedPerson || "N/A"}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </CardContent>
            </Card>

            {/* Section 2 - Right Panel */}
            <div className="w-1/4 h-[600px] flex flex-col gap-6 ">
                {/* Create Todo with Drawer */}
                <div className="relative w-full h-1/15">
                    {/* Small 'Create Todo' button in top-right corner */}
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button className="absolute top-4 right-4 px-4 py-1 text-sm0 text-white rounded-md shadow cursor-pointer ">
                                + Create Todo
                            </Button>
                        </DrawerTrigger>

                        <DrawerContent className=" text-black border-t border-zinc-700 p-6 space-y-4">
                            <DrawerHeader>
                                <DrawerTitle className="text-xl font-semibold">Add New Todo</DrawerTitle>
                                <DrawerDescription className="text-zinc-400">
                                    Enter details for your task.
                                </DrawerDescription>
                            </DrawerHeader>

                            <div className="space-y-4">
                                <Input
                                    placeholder="Title"
                                    value={newTodo.title}
                                    onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                                    className="bg-white text-white"
                                />
                                <Textarea
                                    placeholder="Description"
                                    value={newTodo.description}
                                    onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                                    className="bg-white text-white"
                                />
                                <Select
                                    value={newTodo.priority}
                                    onValueChange={(value) => setNewTodo({ ...newTodo, priority: value })}
                                >
                                    <SelectTrigger className="bg-white text-white w-full">
                                        <SelectValue placeholder="Select Priority" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white text-black border-zinc-700 cursor-pointer">
                                        <SelectItem value="High">High</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Low">Low</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Input
                                    placeholder="Tag"
                                    value={newTodo.tag}
                                    onChange={(e) => setNewTodo({ ...newTodo, tag: e.target.value })}
                                    className="bg-white text-white"
                                />
                                <Input
                                    placeholder="Tagged Person"
                                    value={newTodo.taggedPerson}
                                    onChange={(e) => setNewTodo({ ...newTodo, taggedPerson: e.target.value })}
                                    className="bg-white text-white"
                                />
                            </div>

                            <DrawerFooter>
                                <div className="flex items-center w-full gap-2">
                                    <Button className=" text-black w-1/2" variant={"outline"}>Cancel</Button>

                                    <Button
                                        onClick={handleAddTodo}
                                        className="text-white w-1/2"
                                    >
                                        Add Todo
                                    </Button>
                                </div>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                </div>


                {/* Filter Options */}
                <Card className="h-9/10 border">
                    <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-4">Filter Options</h3>
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className="w-full p-2 rounded-md"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Todos;