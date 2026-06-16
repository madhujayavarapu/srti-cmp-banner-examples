import { Routes, Route, redirect, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import BannerTesting from './pages/BannerTesting'
import Autoblocking from './pages/Autoblocking'
import Base64Viewer from './pages/Base64Viewer'
import RiskAnalysis from './pages/RiskAnalysis'
import GtmIntegration from './pages/GtmIntegration'
import CmpBannerLoader from './components/CmpBannerLoader'

const routes = [
  { path: '/', element: <Home /> },
  { path: '/banner-testing', element: <BannerTesting /> },
  {
    path: '/autoblocking',
    element: <Autoblocking />,
    data: {
      cmpConfig: {
        tenantUUID: '0ec23351-59a4-4543-ad68-78b005d75b25',
        domainUUID: '1ffe0739-8d8a-4292-b049-c1f81a02ff22',
        environment: 'dev-intg-2',
      },
    },
  },
  { path: '/base64-image-viewer', element: <Base64Viewer /> },
  {
    path: '/risk-analysis',
    element: <RiskAnalysis />,
    data: {
      cmpConfig: {
        tenantUUID: '54693874-fe3e-4414-8c08-62558790d940',
        domainUUID: '07c15b21-d742-42c6-ac30-1604ea6d62be',
        environment: 'qa',
      },
    },
  },
  { path: '/gtm-integration', element: <GtmIntegration /> },
]

export default function App() {
  return (
    <Routes>
      <Route element={<CmpBannerLoader />}>
        {routes.map(({ path, element, data }) => (
          <Route key={path} path={path} element={element} handle={data} />
        ))}
      </Route>
    </Routes>
  )
}
