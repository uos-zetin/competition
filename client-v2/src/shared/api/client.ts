import { env } from "../config/env";

import { FetchApiFetcher } from "./fetcher";
import { AuthenticatedFetcher } from "./fetcher.authenticated";

const isLocalhost = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
const fetcherBaseUrl = import.meta.env.DEV || isLocalhost ? "/api" : `${env.serverUrl}/api`;

export const publicFetcher = new FetchApiFetcher(fetcherBaseUrl);
export const authenticatedFetcher = new AuthenticatedFetcher(publicFetcher);
