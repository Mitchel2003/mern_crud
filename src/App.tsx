import { BrowserRouter, Routes, Route } from "react-router-dom";

import { LocationProvider } from "@/context/LocationContext";
import { FormatProvider } from "@/context/FormatContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { UserProvider } from "@/context/UserContext";
import ProtectedRoute from "@/auth/ProtectedRoute";
import RootLayout from "@/layouts/Root";

import Maintenance from "@/pages/Maintenance";
import Curriculum from "@/pages/Curriculum";
import Client from "@/pages/Client";

import Headquarter from "@/pages/Headquarter";
import Country from "@/pages/Country";
import Office from "@/pages/Office";
import Service from "@/pages/Serv";
import State from "@/pages/State";
import Area from "@/pages/Area";
import City from "@/pages/City";

import Dashboard from "@/pages/Dashboard";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import Home from "@/pages/Home";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <LocationProvider>
            <FormatProvider>

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

                      {/* forms routes */}
                      <Route path="/form/curriculum" element={<Curriculum />} />
                      <Route path="/form/curriculums" element={<Curriculum />} />
                      <Route path="/form/curriculum/:id" element={<Curriculum />} />

                      <Route path="/form/maintenance" element={<Maintenance />} />
                      <Route path="/form/maintenances" element={<Maintenance />} />
                      <Route path="/form/maintenance/:id" element={<Maintenance />} />

                      {/* user routes */}
                      {/* <Route path="/users/engineers" element={<Engineer />} /> {/*new engineer*/}
                      {/* <Route path="/users/engineers" element={<Engineer />} /> {/*list engineers*/}
                      {/* <Route path="/users/engineer/:id" element={<Engineer />} /> {/*edit engineer*/}

                      {/* <Route path="/users/medical" element={<Medical />} /> {/*new medical*/}
                      {/* <Route path="/users/medicals" element={<Medical />} /> {/*list medicals*/}
                      {/* <Route path="/user/medical/:id" element={<Medical />} /> {/*edit medical*/}

                      {/* <Route path="/users/admin" element={<Admin />} /> {/*new admin*/}
                      {/* <Route path="/users/admins" element={<Admin />} /> {/*list admins*/}
                      {/* <Route path="/user/admin/:id" element={<Admin />} /> {/*edit admin*/}

                      <Route path="/client" element={<Client />} /> {/*new client*/}
                      <Route path="/clients" element={<Client />} /> {/*list clients*/}
                      <Route path="/client/:id" element={<Client />} /> {/*edit client*/}

                      {/* location routes */}
                      <Route path="/location/service" element={<Service />} /> {/*new service*/}
                      <Route path="/location/services" element={<Service />} /> {/*list services*/}
                      <Route path="/location/service/:id" element={<Service />} /> {/*edit service*/}

                      <Route path="/location/office" element={<Office />} /> {/*new office*/}
                      <Route path="/location/offices" element={<Office />} /> {/*list offices*/}
                      <Route path="/location/office/:id" element={<Office />} /> {/*edit office*/}

                      <Route path="/location/area" element={<Area />} /> {/*new area*/}
                      <Route path="/location/areas" element={<Area />} /> {/*list areas*/}
                      <Route path="/location/area/:id" element={<Area />} /> {/*edit area*/}

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
        </UserProvider>
      </AuthProvider>
    </ThemeProvider >
  )
}

export default App