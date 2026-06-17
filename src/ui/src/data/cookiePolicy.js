function days(maxAge) {
  return Math.round(maxAge / 86400)
}

export const COOKIE_POLICY_SECTIONS = [
  {
    id: 'advertising',
    script: 'advertising.js',
    description:
      'Loaded from index.html to simulate third-party advertising tags. Drops cookies used for ad delivery, conversion tracking, and audience building.',
    cookies: [
      {
        name: '_fbp',
        category: 'Advertising',
        provider: 'Meta (Facebook Pixel)',
        purpose: 'Stores and tracks visits across websites to measure ad campaign performance and build remarketing audiences.',
        type: 'Third-party',
        maxAge: 7776000,
        retention: `${days(7776000)} days (90 days)`,
      },
      {
        name: '_gads',
        category: 'Advertising',
        provider: 'Google Ads',
        purpose: 'Registers a unique ID to record which ads were shown to the user and whether they clicked, for billing and frequency capping.',
        type: 'Third-party',
        maxAge: 31536000,
        retention: '1 year (365 days)',
      },
    ],
  },
  {
    id: 'analytics',
    script: 'analytics.js',
    description:
      'Loaded from index.html to simulate Google Analytics measurement. Drops cookies that distinguish users, sessions, and throttle request rates.',
    cookies: [
      {
        name: '_ga',
        category: 'Analytics',
        provider: 'Google Analytics',
        purpose: 'Registers a unique client ID used to distinguish unique users and calculate visitor, session, and campaign data.',
        type: 'First-party',
        maxAge: 63072000,
        retention: '2 years (730 days)',
      },
      {
        name: '_gid',
        category: 'Analytics',
        provider: 'Google Analytics',
        purpose: 'Registers a unique ID used to distinguish users on a 24-hour window for daily active user reporting.',
        type: 'First-party',
        maxAge: 86400,
        retention: '1 day (24 hours)',
      },
      {
        name: '_gat_UA-12345678-1',
        category: 'Analytics',
        provider: 'Google Analytics',
        purpose: 'Used to throttle the request rate to Google Analytics servers and limit collection on high-traffic pages.',
        type: 'First-party',
        maxAge: 60,
        retention: '1 minute',
      },
    ],
  },
  {
    id: 'performance-functionality',
    script: 'performance-functionality.js',
    description:
      'Loaded from index.html to simulate performance and functionality scripts. In this test environment it also drops sample analytics and marketing cookies for CMP categorization testing.',
    cookies: [
      {
        name: 'analytics_test',
        category: 'Analytics',
        provider: 'Demo Site (test)',
        purpose: 'Dummy analytics cookie used only in this CMP test environment to verify scan detection and consent gating for analytics category.',
        type: 'First-party',
        maxAge: 3600,
        retention: '1 hour',
      },
      {
        name: 'track_marketing',
        category: 'Advertising',
        provider: 'Demo Site (test)',
        purpose: 'Dummy marketing attribution cookie used to test whether advertising consent is required before the cookie is set.',
        type: 'First-party',
        maxAge: 2592000,
        retention: `${days(2592000)} days (30 days)`,
      },
      {
        name: 'ad_client_id',
        category: 'Advertising',
        provider: 'Demo Site (test)',
        purpose: 'Dummy ad client identifier used to simulate a persistent advertising profile cookie dropped by a functionality script.',
        type: 'First-party',
        maxAge: 31536000,
        retention: '1 year (365 days)',
      },
    ],
  },
]

export const RETENTION_POLICY = [
  {
    category: 'Essential',
    policy: 'Retained only for the duration of the session or as long as needed to provide core site functionality. Not used for tracking or profiling.',
    defaultRetention: 'Session to 24 hours',
  },
  {
    category: 'Analytics',
    policy: 'Retained to measure site usage and improve content. Expires automatically after the retention period; no personal profiles are built in this test environment.',
    defaultRetention: '1 minute to 2 years (per cookie)',
  },
  {
    category: 'Advertising',
    policy: 'Retained to deliver and measure ads, limit ad frequency, and support conversion reporting. Requires marketing consent before being set when CMP autoblocking is active.',
    defaultRetention: '30 days to 1 year (per cookie)',
  },
  {
    category: 'Functional',
    policy: 'Retained to remember preferences and enable enhanced features. Cleared when consent is withdrawn or the retention period expires.',
    defaultRetention: 'Up to 1 year',
  },
]

export const ALL_POLICY_COOKIES = COOKIE_POLICY_SECTIONS.flatMap((section) =>
  section.cookies.map((cookie) => ({ ...cookie, script: section.script })),
)
