/**
 * Production: same-origin API (serve Angular from Spring under `/` and APIs under `/api`).
 * Dev member query fallbacks are always null — identity comes from JWT (or session) on the server.
 */
export const environment = {
  production: true,
  apiBaseUrl: '/api',
  devMemberId: null as number | null,
  devMembershipId: null as number | null,
};
