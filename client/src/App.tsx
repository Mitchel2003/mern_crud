import { BrowserRouter, Routes, Route } from "react-router-dom"
import Register from "./pages/Register"
import Login from "./pages/Login"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" index element={<h1 className="text-4xl">Welcome</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/task/:id" element={<h1>get task</h1>} />
        <Route path="/tasks" element={<h1>get tasks</h1>} />
        <Route path="/add-task" element={<h1>add task</h1>} />
        <Route path="/profile" element={<h1>get profile</h1>} />

      </Routes>
    </BrowserRouter>
  )
}

export default App