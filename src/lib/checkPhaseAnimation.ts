/** Donut compare arc — first in the check-phase sequence */
export const CHECK_GAUGE_DELAY_MS = 500
export const CHECK_GAUGE_DURATION_MS = 2000
export const CHECK_GAUGE_END_MS = CHECK_GAUGE_DELAY_MS + CHECK_GAUGE_DURATION_MS

/** Round points — after gauge finishes */
export const CHECK_POINTS_DELAY_MS = CHECK_GAUGE_END_MS
export const CHECK_POINTS_DURATION_MS = 900

/** Age-tier chart — after points count-up finishes */
export const CHECK_AGE_TIER_DELAY_MS =
  CHECK_POINTS_DELAY_MS + CHECK_POINTS_DURATION_MS + 200
