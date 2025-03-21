export type Priority = "High" | "Medium" | "Low"

export interface Note {
  id: string
  content: string
  createdAt: string
}

export interface Todo {
  id: string
  title: string
  description: string
  priority: Priority
  tags: string[]
  userId: string
  mentions?: string[]
  createdAt: string
  notes?: Note[]
}

export interface User {
  id: string
  name: string
  username: string
  email: string
}

