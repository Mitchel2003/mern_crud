import { BrowserRouter, Routes, Route } from "react-router-dom"
import { LocationProvider } from "@/context/LocationContext"
import { FormatProvider } from "@/context/FormatContext"
import { ThemeProvider } from "@/context/ThemeContext"
import { AuthProvider } from "@/context/AuthContext"

/** Layout globals and renders */
import ProtectedRoute from "@/layouts/ProtectedRoute"
import RootLayout from "@/layouts/Root"
import Render from "@/features/Render"

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
                  <Route path="/" index element={<Render.HomePage />} />
                  <Route path="/auth/login" element={<Render.LoginPage />} />

                  <Route path="/equipment" element={<Render.EquipmentHub />} />
                  <Route path="/equipment/:id" element={<Render.EquipmentHub />} />
                  <Route path="/form/curriculum/preview/:id" element={<Render.CurriculumPreviewPage />} />

                  {/* protected routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Render.DashboardPage />} />
                    <Route path="/scanner" element={<Render.ScannerPage />} />

                    {/* collaborator routes */}
                    <Route path="/calendar" element={<Render.CalendarPage />} />

                    {/* forms routes */}
                    <Route path="/form/curriculum" element={<Render.CurriculumPage />} />
                    <Route path="/form/curriculums" element={<Render.CurriculumPage />} />
                    <Route path="/form/curriculum/:id" element={<Render.CurriculumPage />} />

                    <Route path="/form/maintenance" element={<Render.MaintenancePage />} />
                    <Route path="/form/maintenances" element={<Render.MaintenancePage />} />
                    <Route path="/form/maintenance/:id" element={<Render.MaintenancePage />} />
                    <Route path="/form/maintenance-history" element={<Render.MaintenancePage />} />
                    <Route path="/form/maintenance-history/:id" element={<Render.MaintenancePage />} />

                    <Route path="/form/solicit" element={<Render.SolicitPage />} />
                    <Route path="/form/solicits" element={<Render.SolicitPage />} />
                    <Route path="/form/solicit/:id" element={<Render.SolicitPage />} />
                    <Route path="/form/solicit-history" element={<Render.SolicitPage />} />
                    <Route path="/form/solicit-history/:id" element={<Render.SolicitPage />} />

                    <Route path="/form/schedule" element={<Render.SchedulePage />} />
                    <Route path="/form/schedules" element={<Render.SchedulePage />} />
                    <Route path="/form/schedule/:id" element={<Render.SchedulePage />} />

                    {/* user routes */}
                    <Route path="/collaborator" element={<Render.CollaboratorPage />} /> {/*new user*/}
                    <Route path="/collaborators" element={<Render.CollaboratorPage />} /> {/*list users*/}
                    <Route path="/collaborator/:id" element={<Render.CollaboratorPage />} /> {/*edit user*/}

                    <Route path="/company" element={<Render.CompanyPage />} /> {/*new company*/}
                    <Route path="/companies" element={<Render.CompanyPage />} /> {/*list companies*/}
                    <Route path="/company/:id" element={<Render.CompanyPage />} /> {/*edit company*/}

                    <Route path="/newClient" element={<Render.ClientFlowPage />} /> {/*new client*/}
                    <Route path="/client" element={<Render.ClientPage />} /> {/*new client*/}
                    <Route path="/clients" element={<Render.ClientPage />} /> {/*list clients*/}
                    <Route path="/client/:id" element={<Render.ClientPage />} /> {/*edit client*/}
                    <Route path="/client/preview/:id" element={<Render.ClientPreviewPage />} /> {/*preview client*/}

                    {/* location routes */}
                    <Route path="/location/office" element={<Render.OfficePage />} /> {/*new office*/}
                    <Route path="/location/offices" element={<Render.OfficePage />} /> {/*list offices*/}
                    <Route path="/location/office/:id" element={<Render.OfficePage />} /> {/*edit office*/}

                    <Route path="/location/headquarter" element={<Render.HeadquarterPage />} /> {/*new headquarter*/}
                    <Route path="/location/headquarters" element={<Render.HeadquarterPage />} /> {/*list headquarter*/}
                    <Route path="/location/headquarter/:id" element={<Render.HeadquarterPage />} /> {/*edit headquarter*/}

                    <Route path="/location/city" element={<Render.CityPage />} /> {/*new city*/}
                    <Route path="/location/cities" element={<Render.CityPage />} /> {/*list cities*/}
                    <Route path="/location/city/:id" element={<Render.CityPage />} /> {/*edit city*/}

                    <Route path="/location/state" element={<Render.StatePage />} /> {/*new state*/}
                    <Route path="/location/states" element={<Render.StatePage />} /> {/*list states*/}
                    <Route path="/location/state/:id" element={<Render.StatePage />} /> {/*edit state*/}

                    <Route path="/location/country" element={<Render.CountryPage />} /> {/*new country*/}
                    <Route path="/location/countries" element={<Render.CountryPage />} /> {/*list countries*/}
                    <Route path="/location/country/:id" element={<Render.CountryPage />} /> {/*edit country*/}
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