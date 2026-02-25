import type { DomainResult, SocialResult, TrademarkResult, AppStoreResult, SaasResult, GoogleSearchResult } from "../types.js";
export declare function formatDomainsTable(domains: DomainResult[]): string;
export declare function formatSocialTable(social: SocialResult[]): string;
export declare function formatTrademarksTable(trademarks: TrademarkResult[]): string;
export declare function formatAppStoresTable(appStores: AppStoreResult[]): string;
export declare function formatSaasTable(saas: SaasResult[]): string;
export declare function formatGoogleTable(google: GoogleSearchResult[]): string;
