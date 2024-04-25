export function startOfNextMonth() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const nextMonth = new Date(currentYear, currentMonth + 1);

  // Set the next month date to the first day at 00:00:00
  nextMonth.setDate(1);
  nextMonth.setHours(0, 0, 0, 0);

  return nextMonth;
}
