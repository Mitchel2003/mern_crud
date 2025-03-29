import { ThemeContextProps } from '@/interfaces/context.interface'

import DiscoverSection from './DiscoverSection'
import InfoSection from './InfoSection'

const HomeSection = ({ theme }: ThemeContextProps) => (
  <>
    <InfoSection theme={theme} />
    <DiscoverSection theme={theme} />
  </>
)

export default HomeSection