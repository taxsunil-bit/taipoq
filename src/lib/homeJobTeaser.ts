import { getVerifiedPublicVacancies } from "@/lib/vacancies";
import type { VacancyItem } from "@/types/vacancy";

export const HOMEPAGE_JOB_TEASER_LIMIT = 3;

/** Verified open vacancies safe for homepage teaser cards. */
export function filterHomepageJobTeaserItems(items: VacancyItem[]): VacancyItem[] {
  return getVerifiedPublicVacancies(items).slice(0, HOMEPAGE_JOB_TEASER_LIMIT);
}
