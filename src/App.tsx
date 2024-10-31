import { BrowserRouter, Routes, Route } from "react-router-dom";

import { CurriculumProvider } from "@/context/CurriculumContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/auth/ProtectedRoute";
import RootLayout from "@/layouts/Root";

import CurriculumForm from "@/pages/CurriculumForm";
import VerifyAction from "@/pages/auth/VerifyAction";
import Curriculums from "@/pages/Curriculums";
import Maintenance from "@/pages/Maintenance";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
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
                  {/* user routes */}
                  <Route path="/user/profile" element={<Profile />} />
                  {/* forms routes */}
                  <Route path="/form/cvs" element={<Curriculums />} />
                  <Route path="/form/cv/:id" element={<CurriculumForm />} />
                  <Route path="/form/maintenance/:id" element={<Maintenance />} />
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