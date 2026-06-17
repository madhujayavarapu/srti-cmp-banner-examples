export const DEFAULT_CMP_CONFIG = {
  tenantUUID: '359f6755-3b42-4021-bd08-36963c23d350',
  domainUUID: '3548ac45-9f35-4e00-aabb-65324231ae60',
  environment: 'dev',
}

export const GARTNER_CMP_CONFIG = {
  tenantUUID: '8cf83ca4-9ad5-49e7-97a2-bdabf0189b1d',
  domainUUID: 'cdba02fc-457d-4baf-ab6f-7f13f62626e6',
  environment: 'dev-intg-9',
  shouldLoadAutoblocking: false
}

export function resolveCmpConfig(matches = []) {
  // for (let i = matches.length - 1; i >= 0; i--) {
  //   const config = matches[i].handle?.cmpConfig
  //   if (config) return config
  // }
  return GARTNER_CMP_CONFIG
}
