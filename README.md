# Todo List Application

A full-stack todo list application built with React, Node.js, Express, and MongoDB. The application features a modern UI with authentication, task management, and real-time updates.

## Features

### User Management

- **User Registration**: Create new user accounts with username, email, and password
- **Profile Management**: View and update user profile information
- **Input Validation**: Username and email validation with proper error messages
- **User Context**: Global user state management using React Context
- **Session Persistence**: Automatic login state restoration

### Todo Management

- **Create Todos**: Add new todos with title, description, and priority
- **Priority Levels**: Set priority as High, Medium, or Low
- **Completion Status**: Mark todos as complete/incomplete
- **Tags**: Add multiple tags to categorize todos
- **User Assignment**: Assign todos to specific users
- **Notes**: Add detailed notes to each todo
- **Export Functionality**: Export todos in JSON format
- **Filtering & Sorting**:
  - Filter by priority and tags
  - Sort by creation date or priority
  - Pagination support (5 items per page)
  - Search functionality for title and description
- **Real-time Updates**: Immediate UI updates on todo changes

### Note Management

- **Add Notes**: Attach multiple notes to each todo
- **Note Content**: Text content with character limits
- **Timestamp**: Automatic timestamp for each note
- **Validation**: Content validation for notes
- **Modal Interface**: Clean modal UI for note management

## Tech Stack

### Frontend

- **React 19**: Modern UI development with TypeScript
- **TypeScript**: Type-safe development with strict mode
- **Vite**: Fast development and build tool
- **TailwindCSS**: Utility-first CSS framework
- **Radix UI Components**: Accessible UI components
- **React Router DOM**: Client-side routing
- **Axios**: HTTP client for API calls

### Backend

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM with TypeScript support
- **Express Validator**: Request validation
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- MongoDB (or MongoDB Atlas account)
- npm or yarn package manager

## Project Structure

```
todo-list/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── create-todo-modal.tsx
│   │   │   ├── edit-todo-modal.tsx
│   │   │   ├── todo-notes-modal.tsx
│   │   │   ├── todo-item.tsx
│   │   │   └── todo-list.tsx
│   │   ├── context/      # React context providers
│   │   ├── lib/          # Utility functions and types
│   │   ├── pages/        # Page components
│   │   └── App.tsx       # Main application component
│   ├── public/       # Static files
│   └── package.json  # Frontend dependencies
└── backend/          # Node.js backend application
    ├── routes/       # API routes
    │   ├── userRoutes.js
    │   ├── todoRoutes.js
    │   └── noteRoutes.js
    ├── controllers/  # Route controllers
    │   ├── userController.js
    │   ├── todoController.js
    │   └── noteController.js
    ├── models/       # Database models
    │   ├── User.js
    │   ├── Todo.js
    │   └── Note.js
    ├── middlewares/  # Custom middlewares
    │   ├── auth.js
    │   ├── errorHandler.js
    │   └── validators.js
    └── package.json  # Backend dependencies
```

## Getting Started

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:

   ```
   PORT=7777
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Start the development server:
   ```bash
   npm run server
   ```

The backend server will start on `http://localhost:7777`

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following variables:

   ```
   VITE_API_URL=http://localhost:7777
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend application will start on `http://localhost:5173`

## Available Scripts

### Backend

- `npm run server`: Start the development server with nodemon
- `npm start`: Start the production server
- `npm test`: Run tests (if configured)
- `npm run lint`: Run ESLint

### Frontend

- `npm run dev`: Start the development server
- `npm run build`: Build the production version
- `npm run preview`: Preview the production build locally
- `npm run lint`: Run ESLint

## API Endpoints

### User Endpoints

- `POST /api/users/signup`: Create new user
  - Body: `{ username, email, password }`
- `POST /api/users/signin`: User login
  - Body: `{ email, password }`
- `GET /api/users`: Get all users (protected)
- `GET /api/users/:id`: Get user by ID (protected)

### Todo Endpoints

- `GET /api/todos`: Get all todos (protected)
  - Query params: user, priority, tags, sortBy, sortOrder, page
- `GET /api/todos/:id`: Get todo by ID (protected)
- `POST /api/todos`: Create new todo (protected)
  - Body: `{ title, description, priority, tags, assignedUsers }`
- `PUT /api/todos/:id`: Update todo (protected)
  - Body: `{ title, description, priority, tags, assignedUsers }`
- `DELETE /api/todos/:id`: Delete todo (protected)
- `POST /api/todos/:id/notes`: Add note to todo (protected)
  - Body: `{ content }`

### Query Parameters for Todos

- `user`: Filter by user ID
- `priority`: Filter by priority (High/Medium/Low)
- `tags`: Filter by tags (comma-separated)
- `sortBy`: Sort field (createdAt/priority)
- `sortOrder`: Sort order (asc/desc)
- `page`: Page number for pagination

## Database Schema

### User Schema

```typescript
{
  _id: ObjectId,
  username: String,    // required, unique
  email: String,       // required, unique
  password: String,    // required, hashed
  createdAt: Date,     // auto-generated
  updatedAt: Date      // auto-generated
}
```

### Todo Schema

```typescript
{
  _id: ObjectId,
  title: String,       // required
  description: String,
  priority: String,    // enum: "High" | "Medium" | "Low"
  completed: Boolean,  // default: false
  user: ObjectId,      // reference to User
  tags: [String],
  assignedUsers: [ObjectId],  // references to User
  notes: [{
    content: String,
    createdAt: Date
  }],
  createdAt: Date,     // auto-generated
  updatedAt: Date      // auto-generated
}
```
