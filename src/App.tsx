import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { TaskProvider } from "@/context/TaskContext";
import ProtectedRoute from "@/auth/ProtectedRoute";
import TaskForm from "@/pages/TaskForm";
import Profile from "@/pages/Profile";
import Tasks from "@/pages/Tasks";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import RootLayout from "@/layouts/RootLayout";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TaskProvider>

          <BrowserRouter>
            <Routes>
              <Route element={<RootLayout />}>
                <Route path="/" index element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/task/:id" element={<TaskForm />} />
                  <Route path="/tasks" element={<Tasks />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>

        </TaskProvider>
      </AuthProvider>
    </ThemeProvider >
  )
}

export default App