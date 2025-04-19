import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocationProvider } from "@/context/LocationContext";
import { FormatProvider } from "@/context/FormatContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";

import CurriculumPage, { PreviewCurriculumPage } from "@/pages/documents/CurriculumPage";
import ClientPage, { ClientFlowPage } from "@/pages/documents/ClientPage";
import MaintenancePage from "@/pages/documents/MaintenancePage";
import EngineerPage from "@/pages/documents/EngineerPage";
import CompanyPage from "@/pages/documents/CompanyPage";
import SolicitPage from "@/pages/documents/SolicitPage";

import HeadquarterPage from "@/pages/documents/HeadquarterPage";
import CountryPage from "@/pages/documents/CountryPage";
import OfficePage from "@/pages/documents/OfficePage";
import StatePage from "@/pages/documents/StatePage";
import CityPage from "@/pages/documents/CityPage";

import CalendarPage from "@/pages/dashboard/engineer/CalendarPage";
import DocumentsHub from "@/pages/navigation/DocumentsHub";
import SchedulePage from "@/pages/documents/SchedulePage";
import ScannerHub from "@/pages/navigation/ScannerHub";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import DashboardPage from "@/pages/dashboard";
import LoginPage from "@/pages/LoginPage";
import RootLayout from "@/layouts/Root";
import HomePage from "@/pages/HomePage";

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
                  <Route path="/" index element={<HomePage />} />
                  <Route path="/auth/login" element={<LoginPage />} />

                  {/* protected routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/scanner" element={<ScannerHub />} />

                    {/* engineer routes */}
                    <Route path="/calendar" element={<CalendarPage />} />

                    {/* forms routes */}
                    <Route path="/form" element={<DocumentsHub />} /> {/*list documents*/}
                    <Route path="/form/curriculum" element={<CurriculumPage />} />
                    <Route path="/form/curriculums" element={<CurriculumPage />} />
                    <Route path="/form/curriculum/:id" element={<CurriculumPage />} />
                    <Route path="/form/curriculum/preview/:id" element={<PreviewCurriculumPage />} />

                    <Route path="/form/maintenance" element={<MaintenancePage />} />
                    <Route path="/form/maintenances" element={<MaintenancePage />} />
                    <Route path="/form/maintenance/:id" element={<MaintenancePage />} />

                    <Route path="/form/solicit" element={<SolicitPage />} />
                    <Route path="/form/solicits" element={<SolicitPage />} />
                    <Route path="/form/solicit/:id" element={<SolicitPage />} />

                    <Route path="/form/schedule" element={<SchedulePage />} />
                    <Route path="/form/schedules" element={<SchedulePage />} />
                    <Route path="/form/schedule/:id" element={<SchedulePage />} />

                    {/* user routes */}
                    <Route path="/engineer" element={<EngineerPage />} /> {/*new user*/}
                    <Route path="/engineers" element={<EngineerPage />} /> {/*list users*/}
                    <Route path="/engineer/:id" element={<EngineerPage />} /> {/*edit user*/}

                    <Route path="/company" element={<CompanyPage />} /> {/*new company*/}
                    <Route path="/companies" element={<CompanyPage />} /> {/*list companies*/}
                    <Route path="/company/:id" element={<CompanyPage />} /> {/*edit company*/}

                    <Route path="/newClient" element={<ClientFlowPage />} /> {/*new client*/}
                    <Route path="/client" element={<ClientPage />} /> {/*new client*/}
                    <Route path="/clients" element={<ClientPage />} /> {/*list clients*/}
                    <Route path="/client/:id" element={<ClientPage />} /> {/*edit client*/}

                    {/* location routes */}
                    <Route path="/location/office" element={<OfficePage />} /> {/*new office*/}
                    <Route path="/location/offices" element={<OfficePage />} /> {/*list offices*/}
                    <Route path="/location/office/:id" element={<OfficePage />} /> {/*edit office*/}

                    <Route path="/location/headquarter" element={<HeadquarterPage />} /> {/*new headquarter*/}
                    <Route path="/location/headquarters" element={<HeadquarterPage />} /> {/*list headquarter*/}
                    <Route path="/location/headquarter/:id" element={<HeadquarterPage />} /> {/*edit headquarter*/}

                    <Route path="/location/city" element={<CityPage />} /> {/*new city*/}
                    <Route path="/location/cities" element={<CityPage />} /> {/*list cities*/}
                    <Route path="/location/city/:id" element={<CityPage />} /> {/*edit city*/}

                    <Route path="/location/state" element={<StatePage />} /> {/*new state*/}
                    <Route path="/location/states" element={<StatePage />} /> {/*list states*/}
                    <Route path="/location/state/:id" element={<StatePage />} /> {/*edit state*/}

                    <Route path="/location/country" element={<CountryPage />} /> {/*new country*/}
                    <Route path="/location/countries" element={<CountryPage />} /> {/*list countries*/}
                    <Route path="/location/country/:id" element={<CountryPage />} /> {/*edit country*/}
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