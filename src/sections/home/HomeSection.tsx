import { ThemeContextProps } from '@/interfaces/context.interface'

import DiscoverSection from './DiscoverSection'
import InfoSection from './InfoSection'

const HomeSection = ({ theme }: ThemeContextProps) => {
  return (
    <div>
      <InfoSection theme={theme} />
      <DiscoverSection theme={theme} />
    </div>
  )
}

export default HomeSection