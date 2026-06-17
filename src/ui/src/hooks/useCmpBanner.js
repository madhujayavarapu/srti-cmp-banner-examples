import { useLocation } from 'react-router-dom'
import useExternalScript from './useExternalScript'
import { ENVIRONMENTS } from '../data/environments'

/**
 * Load the Securiti CMP banner scripts (autoblocking + SDK loader).
 * Re-injects on every route navigation and when config changes.
 *
 * @param {Object} config
 * @param {string} config.tenantUUID - Securiti tenant UUID
 * @param {string} config.domainUUID - Securiti domain UUID
 * @param {string} [config.environment='dev'] - Environment key (dev, dev-intg-2, qa, prod)
 * @param {boolean} [config.skipCss=false] - Skip CMP banner CSS
 * @param {Object} [config.dataAttributes={}] - Extra data-* attributes for the SDK loader script
 * @param {boolean} [config.enabled=true] - Whether to inject scripts (false = no injection)
 */
export default function useCmpBanner({
  tenantUUID,
  domainUUID,
  environment = 'dev',
  skipCss = false,
  dataAttributes = {},
  enabled = true,
  shouldLoadAutoblocking = false,
}) {
  const { pathname } = useLocation()
  const { cdn, backend } = ENVIRONMENTS[environment]

  if(shouldLoadAutoblocking) {
    useExternalScript(
      `${cdn}/consent/auto_blocking/${tenantUUID}/${domainUUID}.js`,
      {},
      'head',
      enabled,
      pathname,
    )
  }

  useExternalScript(
    `${cdn}/consent/cookie-consent-sdk-loader.js`,
    {
      'data-tenant-uuid': tenantUUID,
      'data-domain-uuid': domainUUID,
      'data-backend-url': backend,
      'data-skip-css': String(skipCss),
      ...dataAttributes,
    },
    'body',
    enabled,
    pathname,
  )
}
