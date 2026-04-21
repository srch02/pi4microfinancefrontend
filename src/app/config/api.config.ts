import { environment } from '../../environments/environment';

/**
 * Re-exports API settings from `environment` (dev vs prod via fileReplacements).
 * With JWT, prefer authenticated calls without `devMemberId` / `devMembershipId` (both null in prod).
 */
export const API_CONFIG = {
  get baseUrl(): string {
    return environment.apiBaseUrl;
  },
  get devMemberId(): number | null {
    return environment.devMemberId;
  },
  get devMembershipId(): number | null {
    return environment.devMembershipId;
  },
};
