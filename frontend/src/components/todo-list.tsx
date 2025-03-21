import { useEffect, useState } from "react";
import axios from "axios";
import { useUserContext } from "@/context/UserContext";
import { Plus, Filter, SortAsc, SortDesc, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import TodoItem from "@/components/todo-item";
import CreateTodoModal from "@/components/create-todo-modal";
import type { Priority, Todo, User } from "@/lib/types";

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [displayedTodos, setDisplayedTodos] = useState<Todo[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filters stored in an object
  const [filters, setFilters] = useState<{
    priority: Priority[];
    tags: string[];
  }>({ priority: [], tags: [] });

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortBy, setSortBy] = useState<"date" | "priority">("date");

  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 5;

  const { user: loggedInUser } = useUserContext();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/users");
        const userList: User[] = res.data;
        setUsers(userList);
        const matched = userList.find((u) => u.username === loggedInUser?.username);
        setCurrentUser(matched || userList[0]);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, [loggedInUser]);

  useEffect(() => {
    const fetchTodos = async () => {
      if (!currentUser) return;
      try {
        const res = await axios.get(`/api/todos?user=${currentUser._id}`);
        setTodos(res.data.todos);
      } catch (err) {
        console.error("Failed to fetch todos", err);
      }
    };

    fetchTodos();
  }, [currentUser]);

  useEffect(() => {
    let filtered = [...todos];

    // Priority Filter
    if (filters.priority.length > 0) {
      filtered = filtered.filter((todo) => filters.priority.includes(todo.priority));
    }

    // Tag Filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter((todo) => todo.tags.some((tag) => filters.tags.includes(tag)));
    }

    // Search
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (todo) =>
          todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          todo.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sorting
    if (sortBy === "date") {
      filtered.sort((a, b) =>
        sortOrder === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortBy === "priority") {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      filtered.sort((a, b) =>
        sortOrder === "asc"
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority]
      );
    }

    // Pagination
    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    const paginated = filtered.slice(indexOfFirstTodo, indexOfLastTodo);

    setDisplayedTodos(paginated);
  }, [todos, filters, searchQuery, sortBy, sortOrder, currentPage]);

  const handleCreateTodo = async (todoData: Omit<Todo, "_id" | "createdAt">) => {
    try {
      const res = await axios.post("/api/todos", { ...todoData, user: currentUser?._id });
      setTodos((prev) => [res.data, ...prev]);
      setIsCreateModalOpen(false);
      setCurrentPage(1);
    } catch (err) {
      console.error("Create Todo Error", err);
    }
  };

  const handleUpdateTodo = async (updatedTodo: Todo) => {
    try {
      const res = await axios.put(`/api/todos/${updatedTodo._id}`, updatedTodo);
      setTodos((prev) => prev.map((t) => (t._id === updatedTodo._id ? res.data : t)));
    } catch (err) {
      console.error("Update Todo Error", err);
    }
  };

  const handleDeleteTodo = async (_id: string) => {
    try {
      await axios.delete(`/api/todos/${_id}`);
      setTodos((prev) => prev.filter((t) => t._id !== _id));
    } catch (err) {
      console.error("Delete Todo Error", err);
    }
  };

  const handleExportTodos = () => {
    try {
      const blob = new Blob([JSON.stringify(todos, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `todos-${currentUser?.username}.json`;
      link.click();
    } catch (err) {
      console.error("Export Todos Error", err);
    }
  };

  const allTags = Array.from(new Set(todos.flatMap((t) => t.tags)));
  const totalPages = Math.ceil(
    todos.filter((todo) => {
      let matches = true;
      if (filters.priority.length > 0) matches = matches && filters.priority.includes(todo.priority);
      if (filters.tags.length > 0) matches = matches && todo.tags.some((tag) => filters.tags.includes(tag));
      if (searchQuery.trim()) {
        matches =
          matches &&
          (todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            todo.description.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      return matches;
    }).length / todosPerPage
  );

  const togglePriorityFilter = (value: Priority) => {
    setFilters((prev) => ({
      ...prev,
      priority: prev.priority.includes(value)
        ? prev.priority.filter((p) => p !== value)
        : [...prev.priority, value],
    }));
    setCurrentPage(1);
  };

  const toggleTagFilter = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Hey, {currentUser?.username ? currentUser.username.charAt(0).toUpperCase() + currentUser.username.slice(1) : "Guest"}! Let’s crush it today! 🚀💥😎</h1>


        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Todo
        </Button>
      </div>

      <Tabs defaultValue="todos">
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="todos">
          <div className="flex flex-wrap gap-4 my-4">
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search todos..."
              className="flex-1"
            />

            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Priority</DropdownMenuLabel>
                {["high", "medium", "low"].map((priority) => (
                  <DropdownMenuItem key={priority} onClick={() => togglePriorityFilter(priority as Priority)}>
                    <input
                      type="checkbox"
                      checked={filters.priority.includes(priority as Priority)}
                      readOnly
                      className="mr-2"
                    />
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Tags</DropdownMenuLabel>
                {allTags.map((tag) => (
                  <DropdownMenuItem key={tag} onClick={() => toggleTagFilter(tag)}>
                    <input
                      type="checkbox"
                      checked={filters.tags.includes(tag)}
                      readOnly
                      className="mr-2"
                    />
                    {tag}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {sortOrder === "asc" ? <SortAsc className="mr-2 h-4 w-4" /> : <SortDesc className="mr-2 h-4 w-4" />}
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <label className="flex items-center space-x-2 cursor-pointer w-full">
                    <input
                      type="radio"
                      name="sortBy"
                      value="date"
                      checked={sortBy === "date"}
                      onChange={() => setSortBy("date")}
                    />
                    <span>Date</span>
                  </label>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <label className="flex items-center space-x-2 cursor-pointer w-full">
                    <input
                      type="radio"
                      name="sortBy"
                      value="priority"
                      checked={sortBy === "priority"}
                      onChange={() => setSortBy("priority")}
                    />
                    <span>Priority</span>
                  </label>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortOrder("asc")}>
                  <input
                    type="radio"
                    readOnly
                    checked={sortOrder === "asc"}
                    className="mr-2"
                  />
                  Ascending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("desc")}>
                  <input
                    type="radio"
                    readOnly
                    checked={sortOrder === "desc"}
                    className="mr-2"
                  />
                  Descending
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" onClick={handleExportTodos}>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>

          <div className="space-y-4">
            {displayedTodos.length > 0 ? (
              displayedTodos.map((todo) => (
                <TodoItem
                  key={todo._id}
                  todo={todo}
                  users={users}
                  onUpdate={handleUpdateTodo}
                  onDelete={handleDeleteTodo}
                  currentUser={currentUser}
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground">No todos found.</p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="cursor-pointer"
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink isActive={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)}>
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </TabsContent>

        <TabsContent value="users">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {users.map((user) => (
              <div
                key={user._id}
                className={`p-4 border rounded-md ${currentUser?._id === user._id
                  ? "bg-primary text-white"
                  : "bg-muted/50"
                  }`}
              >
                <h4 className="font-semibold text-sm">@{user.username}</h4>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                {currentUser?._id === user._id && (
                  <p className="text-xs mt-1 italic text-primary-foreground">
                    (Logged in)
                  </p>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <CreateTodoModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTodo}
        users={users}
        currentUser={currentUser}
      />
    </div>
  );
}
