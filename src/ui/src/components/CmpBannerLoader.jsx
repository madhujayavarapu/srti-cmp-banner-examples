import { Outlet, useMatches } from 'react-router-dom'
import useCmpBanner from '../hooks/useCmpBanner'
import { resolveCmpConfig } from '../data/cmpConfigs'

export default function CmpBannerLoader() {
  // const matches = useMatches()

  // useCmpBanner(resolveCmpConfig(matches))

  return <Outlet />
}
