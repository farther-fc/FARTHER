export function getStartOfNextMonthUTC() {
  // Get the current date in UTC
  const currentDate = new Date();

  // Extract the year and month in UTC
  const currentYear = currentDate.getUTCFullYear();
  const currentMonth = currentDate.getUTCMonth();

  // Calculate the first day of the next month
  const nextMonth = new Date(
    Date.UTC(currentYear, currentMonth + 1, 1, 0, 0, 0, 0),
  );

  return nextMonth;
}
