import { env } from "../config/env";

import { FetchApiFetcher } from "./fetcher";
import { AuthenticatedFetcher } from "./fetcher.authenticated";

export const publicFetcher = new FetchApiFetcher(env.serverUrl);
export const authenticatedFetcher = new AuthenticatedFetcher(publicFetcher);
