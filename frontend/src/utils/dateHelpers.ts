/**
 * Parses a date string into a Date object using LOCAL time components,
 * avoiding the UTC-conversion pitfalls of `new Date(string)`.
 *
 * Accepts both shapes the app may encounter:
 *  - a bare date string, e.g. "2026-08-24" (what DatePicker produces)
 *  - a full ISO datetime string, e.g. "2026-08-24T00:00:00.000Z"
 *    (what the backend sends, via Mongoose's Date -> JSON serialization)
 */
export const parseLocalDate = (dateString: string): Date => {
  const datePart = dateString.split('T')[0];
  const [year, month, day] = datePart.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/** Formats a Date into a bare "YYYY-MM-DD" string using LOCAL time components. */
export const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/** Normalizes any accepted date string shape into a bare "YYYY-MM-DD" string. */
export const toDateOnly = (dateString: string): string => {
  return formatLocalDate(parseLocalDate(dateString));
};

/** Today's date at local midnight — the correct "today" to compare calendar dates against. */
export const startOfToday = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};