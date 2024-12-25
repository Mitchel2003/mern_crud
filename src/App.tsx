import { BrowserRouter, Routes, Route } from "react-router-dom";

import { CurriculumProvider } from "@/context/CurriculumContext";
import { LocationProvider } from "@/context/LocationContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/auth/ProtectedRoute";
import RootLayout from "@/layouts/Root";

import MaintenanceForm from "@/pages/MaintenanceForm";
import CurriculumForm from "@/pages/CurriculumForm";
import CurriculumList from "@/pages/CurriculumList";
import CountryList from "@/pages/CountryList";
import Dashboard from "@/pages/Dashboard";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import Home from "@/pages/Home";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LocationProvider>
          <CurriculumProvider>

            <BrowserRouter>
              <Routes>
                <Route element={<RootLayout />}>
                  {/* home index */}
                  <Route path="/" index element={<Home />} />

                  {/* auth routes */}
                  <Route path="/auth/login" element={<Login />} />
                  <Route path="/auth/register" element={<Register />} />

                  {/* protected routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/form/cvs" element={<CurriculumList />} />
                    <Route path="/form/cv/:id" element={<CurriculumForm />} />
                    <Route path="/location/countries" element={<CountryList />} />
                    <Route path="/form/maintenance/:id" element={<MaintenanceForm />} />
                  </Route>

                </Route>
              </Routes>
            </BrowserRouter>

          </CurriculumProvider>
        </LocationProvider>
      </AuthProvider>
    </ThemeProvider >
  )
}

export default App