import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { TaskProvider } from "@/context/TaskContext";
import ProtectedRoute from "@/auth/ProtectedRoute";
import RootLayout from "@/layouts/Root";

import Maintenance from "@/pages/Maintenance";
import TaskForm from "@/pages/TaskForm";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";
import Home from "@/pages/Home";

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
                <Route path="/maintenance" element={<Maintenance />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/task/:id" element={<TaskForm />} />
                  {/* <Route path="/tasks" element={<Tasks />} /> */}
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