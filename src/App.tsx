import { BrowserRouter, Routes, Route } from "react-router-dom";

import { CurriculumProvider } from "@/context/CurriculumContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/auth/ProtectedRoute";
import RootLayout from "@/layouts/Root";

import CurriculumForm from "@/pages/CurriculumForm";
import Curriculums from "@/pages/Curriculums";
import Maintenance from "@/pages/Maintenance";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";
import Home from "@/pages/Home";

import VerifyEmail from "@/pages/auth/VerifyEmail";
import ResetPassword from "@/pages/auth/ResetPassword";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CurriculumProvider>

          <BrowserRouter>
            <Routes>
              <Route element={<RootLayout />}>
                {/* home and auth */}
                <Route path="/" index element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/verify-email/:email/:token" element={<VerifyEmail />} />

                <Route element={<ProtectedRoute />}>
                  {/* user routes */}
                  <Route path="/profile" element={<Profile />} />
                  {/* formats */}
                  <Route path="/cvs" element={<Curriculums />} />
                  <Route path="/cv/:id" element={<CurriculumForm />} />
                  <Route path="/maintenance/:id" element={<Maintenance />} />
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