import CollaboratorSection from './CollaboratorDashboardPage'
import Unauthorized from '#/common/skeletons/Unautorized'
import { useThemeContext } from '@/context/ThemeContext'
import { useAuthContext } from '@/context/AuthContext'
import ClientSection from './ClientDashboardPage'
import AdminSection from './AdminDashboardPage'

const DashboardPage = () => {
  const { theme } = useThemeContext()
  const { user } = useAuthContext()

  switch (user?.role) {
    case 'admin': return <AdminSection theme={theme} />
    case 'client': return <ClientSection theme={theme} />
    case 'collaborator': return <CollaboratorSection theme={theme} />
    case 'company': return <></>
    default: return <Unauthorized theme={theme} />
  }
}

export default DashboardPage