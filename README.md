# Task Management Application

A full-stack task management application built with React, TypeScript, and ASP.NET Core. This application allows users to manage their tasks with features like task creation, editing, deletion, and filtering.

## Features

### Authentication
- User registration with email and password
- Secure login functionality
- JWT-based authentication
- Protected routes

### Task Management
- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Set due dates for tasks
- Add descriptions to tasks

### Task Filtering
- Filter by status (All/Completed/Pending)
- Filter by due date:
  - Due Today
  - Due This Week
  - Due This Month

### User Interface
- Modern, responsive design
- Dark theme
- Intuitive task management interface
- Real-time updates
- Loading states and error handling

## Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- React Hook Form
- Axios for API calls
- React Context for state management

### Backend
- ASP.NET Core
- Entity Framework Core
- JWT Authentication
- SQL Server Database
- AutoMapper
- Swagger for API documentation

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- .NET 6.0 SDK or higher
- SQL Server
- Visual Studio 2022 or Visual Studio Code

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ahmedafe1/taskManager.git
```

2. Set up the backend:
```bash
cd TaskManagementSystem.API
dotnet restore
dotnet build
```

3. Configure the database:
- Update the connection string in `appsettings.json`
- Run the database migrations:
```bash
dotnet ef database update
```

4. Start the backend server:
```bash
dotnet run
```

5. Set up the frontend:
```bash
cd task-management-frontend
npm install
```

6. Start the frontend development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email and password

### Tasks
- `GET /api/tasks` - Get all tasks for the authenticated user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task

## Project Structure

```
task-management/
├── task-management-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   └── tasks/
│   │   ├── contexts/
│   │   ├── services/
│   │   └── types/
│   └── public/
└── TaskManagementSystem.API/
    ├── Controllers/
    ├── Models/
    ├── Services/
    ├── Data/
    ├── DTOs/
    ├── Helpers/
    └── appsettings.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or suggestions, please open an issue in the repository. 
