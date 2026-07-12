/**
 * Server-readable snapshot of published live vacancy JSON.
 * Used so first HTML paint can show real counts/cards without waiting on client fetch.
 * Client surfaces may still refresh via loadVacanciesLive() for freshness.
 */
import publishedVacancies from "../../public/data/vacancies.json";
import { normalizeVacanciesPayload } from "./vacanciesSource.mjs";
import type { VacanciesPayload } from "@/types/vacancy";

export function getPublishedVacanciesSnapshot(): VacanciesPayload {
  return normalizeVacanciesPayload(publishedVacancies);
}
