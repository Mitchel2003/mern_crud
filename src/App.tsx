import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import TaskForm from "./pages/TaskForm";
import Profile from "./pages/Profile";
import Tasks from "./pages/Tasks";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/global/Navbar";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TaskProvider>

          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" index element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/task/:id" element={<TaskForm />} />
                <Route path="/tasks" element={<Tasks />} />
              </Route>
            </Routes>
          </BrowserRouter>

        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App