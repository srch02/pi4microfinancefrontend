/**
 * Default environment for `ng serve` and non-production builds.
 * Production uses `environment.prod.ts` via `angular.json` fileReplacements.
 */
export const environment = {
  production: false,
  apiBaseUrl: '/api',
  /** Only used when not authenticated; omit in real flows once JWT is wired */
  devMemberId: null as number | null,
  devMembershipId: null as number | null,
};
