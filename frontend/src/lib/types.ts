export type Priority = "High" | "Medium" | "Low";

export interface Note {
  _id: string;
  content: string;
  createdAt: string;
}

export interface Todo {
  a: any;
  b: any;
  user: any;
  _id: string;
  title: string;
  description: string;
  priority: Priority;
  tags: string[];
  userId: string;
  assignedUsers?: User[];
  createdAt: string;
  notes?: Note[];
}

export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
}
