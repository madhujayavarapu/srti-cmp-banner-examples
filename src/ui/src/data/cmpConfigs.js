export const DEFAULT_CMP_CONFIG = {
  tenantUUID: '359f6755-3b42-4021-bd08-36963c23d350',
  domainUUID: '3548ac45-9f35-4e00-aabb-65324231ae60',
  environment: 'dev',
}

export function resolveCmpConfig(matches = []) {
  // for (let i = matches.length - 1; i >= 0; i--) {
  //   const config = matches[i].handle?.cmpConfig
  //   if (config) return config
  // }
  return DEFAULT_CMP_CONFIG
}
