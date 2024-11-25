import { BrowserRouter, Routes, Route } from "react-router-dom";

import { CurriculumProvider } from "@/context/CurriculumContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/auth/ProtectedRoute";
import RootLayout from "@/layouts/Root";

import MaintenanceForm from "@/pages/MaintenanceForm";
import CurriculumForm from "@/pages/CurriculumForm";
import CurriculumList from "./pages/CurriculumList";
import VerifyAction from "@/pages/VerifyAction";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import Home from "@/pages/Home";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CurriculumProvider>

          <BrowserRouter>
            <Routes>
              <Route element={<RootLayout />}>
                {/* home index */}
                <Route path="/" index element={<Home />} />

                {/* auth routes */}
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/verify-action" element={<VerifyAction />} />

                <Route element={<ProtectedRoute />}>
                  {/* protected routes */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/form/cvs" element={<CurriculumList />} />
                  <Route path="/form/cv/:id" element={<CurriculumForm />} />
                  <Route path="/form/maintenance/:id" element={<MaintenanceForm />} />
                </Route>

              </Route>
            </Routes>
          </BrowserRouter>

        </CurriculumProvider>
      </AuthProvider>
    </ThemeProvider >
  )
}

export default App