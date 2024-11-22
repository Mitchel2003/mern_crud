import { BrowserRouter, Routes, Route } from "react-router-dom";

import { CurriculumProvider } from "@/context/CurriculumContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/auth/ProtectedRoute";
import RootLayout from "@/layouts/Root";

import MaintenanceForm from "@/pages/form/MaintenanceForm";
import CurriculumForm from "@/pages/form/CurriculumForm";
import VerifyAction from "@/pages/auth/VerifyAction";
import Dashboard from "@/pages/task/Dashboard";
import Products from "@/pages/task/Products";
import Register from "@/pages/auth/Register";
import Login from "@/pages/auth/Login";
import Home from "@/pages/home/Home";

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

                {/* mean while */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/form/cv/:id" element={<CurriculumForm />} />
                <Route path="/form/maintenance/:id" element={<MaintenanceForm />} />

                <Route element={<ProtectedRoute />}>
                  {/* forms routes */}
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