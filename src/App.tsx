import { BrowserRouter, Routes, Route } from "react-router-dom";

import { LocationProvider } from "@/context/LocationContext";
import { ThemeProvider } from "@/context/ThemeContext";
// import { FormsProvider } from "@/context/FormsContext";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/auth/ProtectedRoute";
import RootLayout from "@/layouts/Root";

// import MaintenanceForm from "@/pages/MaintenanceForm";
// import CurriculumForm from "@/pages/CurriculumForm";
// import CurriculumList from "@/pages/CurriculumList";
import Dashboard from "@/pages/Dashboard";
import Register from "@/pages/Register";
import Country from "@/pages/Country";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <LocationProvider>
            {/* <FormsProvider> */}

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
                    <Route path="/location/country" element={<Country />} />

                    {/** test this routes */}
                    {/* <Route path="/form/cvs" element={<CurriculumList />} /> */}
                    {/* <Route path="/form/cv/:id" element={<CurriculumForm />} /> */}
                    {/* <Route path="/form/maintenance/:id" element={<MaintenanceForm />} /> */}
                  </Route>

                </Route>
              </Routes>
            </BrowserRouter>

            {/* </FormsProvider> */}
          </LocationProvider>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider >
  )
}

export default App