<img width="3735" height="1886" alt="image" src="https://github.com/user-attachments/assets/1248f985-3233-4859-b5ac-09ff187de84b" />

# Kanban Task Board

A full-stack Kanban-style task management application with an **ASP.NET Core Minimal API** backend and a **React + TypeScript** frontend.

Users can:
- Create, edit, and delete tasks
- Organise tasks by status (Not Started, In Progress, Completed, Cancelled)
- Filter tasks by status
- View basic statistics and overdue indicators


# Setup Instrctions 
- Clone the repository:
git clone https://github.com/laurajiao/todo-app.git

- Backend setup (ASP.NET Core Minimal API)
   
  From the repo root:
  
  1.cd server

  2.dotnet restore

  3.dotnet run

  4.The API will start on a URL similar to: https://localhost:7295

- Frontend setup (Vite + React + TypeScript)
  
  1.Open a new terminal window (still in the repo root):
     
  2.cd client
     
  3.npm install

  4.Create a .env file in the client directory:VITE_API_BASE=https://localhost:7295

  5.Start the frontend dev server: npm run dev
  
  6.By default, the app will be available at:http://localhost:5173

# How to run locally (summary)
1.Backend:
cd todo-app/server
dotnet run

2.Frontend:
cd todo-app/client
npm run dev

3.Open the frontend in your browser:http://localhost:5173

4.Ensure VITE_API_BASE in client/.env matches the backend URL

# Technology & Library used
Backend

-ASP.NET Core Minimal API

-C#

-Entity Framework Core 

-REST-style endpoints

Frontend

-React (with Vite)

-TypeScript

-Tailwind CSS

-shadcn/ui 

-Native fetch API wrapped in an api.ts module using VITE_API_BASE

# Future Improvement

-No drag-and-drop between columns yet

-No authentication or user management

-Backend validation is minimal and could be expanded

-Possible future enhancements: 

1.Drag-and-drop to change status

2.Text search for tasks

3.Advanced filters (e.g. by date range)

4.Dark mode toggle
