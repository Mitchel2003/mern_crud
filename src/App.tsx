import { BrowserRouter, Routes, Route } from "react-router-dom";

import { LocationProvider } from "@/context/LocationContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { UserProvider } from "@/context/UserContext";
import ProtectedRoute from "@/auth/ProtectedRoute";
import RootLayout from "@/layouts/Root";

import Dashboard from "@/pages/Dashboard";
import Register from "@/pages/Register";
import Country from "@/pages/Country";
import State from "@/pages/State";
import Login from "@/pages/Login";
import City from "@/pages/City";
import Home from "@/pages/Home";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <LocationProvider>
            {/* <FormsProvider> // anteriormente llamado CurriculumProvider */}

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
                    {/** test this routes */}
                    {/* <Route path="/form/cvs" element={<CurriculumList />} /> */}
                    {/* <Route path="/form/cv/:id" element={<CurriculumForm />} /> */}
                    {/* <Route path="/form/maintenance/:id" element={<MaintenanceForm />} /> */}

                    {/* location routes */}
                    <Route path="/location/country" element={<Country />} /> {/*new country*/}
                    <Route path="/location/countries" element={<Country />} />{/*list countries*/}
                    <Route path="/location/country/:id" element={<Country />} />{/*edit country*/}

                    <Route path="/location/state" element={<State />} /> {/*new state*/}
                    <Route path="/location/states" element={<State />} />{/*list states*/}
                    <Route path="/location/state/:id" element={<State />} />{/*edit state*/}

                    <Route path="/location/city" element={<City />} /> {/*new city*/}
                    <Route path="/location/cities" element={<City />} />{/*list cities*/}
                    <Route path="/location/city/:id" element={<City />} />{/*edit city*/}
                  </Route>

                </Route>
              </Routes>
            </BrowserRouter>

            {/* </FormsProvider> // anteriormente llamado CurriculumProvider */}
          </LocationProvider>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider >
  )
}

export default App