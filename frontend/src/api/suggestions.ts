import { http } from "./http";
import type { ProductionSuggestionResponse } from "../types";

export const suggestionsApi = {
  get: () => http<ProductionSuggestionResponse>("/production-suggestions"),
};
