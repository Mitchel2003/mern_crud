import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";
import ProtectedRoute from "./secure/ProtectedRoute";
import TaskForm from "./pages/TaskForm";
import Profile from "./pages/Profile";
import Tasks from "./pages/Tasks";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/task/:id" element={<TaskForm />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TaskProvider>
    </AuthProvider>
  )
}

export default App