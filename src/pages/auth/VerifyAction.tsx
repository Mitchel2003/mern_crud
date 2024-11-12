import { useSearchParams } from 'react-router-dom'
import ResetPassword from './ResetPassword'
import VerifyEmail from './VerifyEmail'

function VerifyAction() {
  const [searchParams] = useSearchParams()  
  const mode = searchParams.get('mode')

  if (mode === 'verifyEmail') return <VerifyEmail />
  if (mode === 'resetPassword') return <ResetPassword />

  return <div>Verificando acción...</div>
}

export default VerifyAction