import { BrowserRouter, Routes, Route } from "react-router-dom";

import { LocationProvider } from "@/context/LocationContext";
import { FormatProvider } from "@/context/FormatContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/auth/ProtectedRoute";
import RootLayout from "@/layouts/Root";

import Curriculum, { PreviewCurriculum } from "@/pages/Curriculum";
import Client, { ClientFlow } from "@/pages/Client";
import Maintenance from "@/pages/Maintenance";
import Engineer from "@/pages/Engineer";
import Company from "@/pages/Company";

import Headquarter from "@/pages/Headquarter";
import Country from "@/pages/Country";
import Office from "@/pages/Office";
import State from "@/pages/State";
import City from "@/pages/City";

import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Home from "@/pages/Home";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LocationProvider>
          <FormatProvider>

            <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
              <Routes>
                <Route element={<RootLayout />}>
                  {/* home index */}
                  <Route path="/" index element={<Home />} />
                  <Route path="/auth/login" element={<Login />} />

                  {/* protected routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* forms routes */}
                    <Route path="/form/curriculum" element={<Curriculum />} />
                    <Route path="/form/curriculums" element={<Curriculum />} />
                    <Route path="/form/curriculum/:id" element={<Curriculum />} />
                    <Route path="/form/curriculum/preview/:id" element={<PreviewCurriculum />} />

                    <Route path="/form/maintenance" element={<Maintenance />} />
                    <Route path="/form/maintenances" element={<Maintenance />} />
                    <Route path="/form/maintenance/:id" element={<Maintenance />} />

                    {/* user routes */}
                    <Route path="/engineer" element={<Engineer />} /> {/*new user*/}
                    <Route path="/engineers" element={<Engineer />} /> {/*list users*/}
                    <Route path="/engineer/:id" element={<Engineer />} /> {/*edit user*/}

                    <Route path="/company" element={<Company />} /> {/*new company*/}
                    <Route path="/companies" element={<Company />} /> {/*list companies*/}
                    <Route path="/company/:id" element={<Company />} /> {/*edit company*/}

                    <Route path="/newClient" element={<ClientFlow />} /> {/*new client*/}
                    <Route path="/client" element={<Client />} /> {/*new client*/}
                    <Route path="/clients" element={<Client />} /> {/*list clients*/}
                    <Route path="/client/:id" element={<Client />} /> {/*edit client*/}

                    {/* location routes */}
                    <Route path="/location/office" element={<Office />} /> {/*new office*/}
                    <Route path="/location/offices" element={<Office />} /> {/*list offices*/}
                    <Route path="/location/office/:id" element={<Office />} /> {/*edit office*/}

                    <Route path="/location/headquarter" element={<Headquarter />} /> {/*new headquarter*/}
                    <Route path="/location/headquarters" element={<Headquarter />} /> {/*list headquarter*/}
                    <Route path="/location/headquarter/:id" element={<Headquarter />} /> {/*edit headquarter*/}

                    <Route path="/location/city" element={<City />} /> {/*new city*/}
                    <Route path="/location/cities" element={<City />} /> {/*list cities*/}
                    <Route path="/location/city/:id" element={<City />} /> {/*edit city*/}

                    <Route path="/location/state" element={<State />} /> {/*new state*/}
                    <Route path="/location/states" element={<State />} /> {/*list states*/}
                    <Route path="/location/state/:id" element={<State />} /> {/*edit state*/}

                    <Route path="/location/country" element={<Country />} /> {/*new country*/}
                    <Route path="/location/countries" element={<Country />} /> {/*list countries*/}
                    <Route path="/location/country/:id" element={<Country />} /> {/*edit country*/}
                  </Route>

                </Route>
              </Routes>
            </BrowserRouter>

          </FormatProvider>
        </LocationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App