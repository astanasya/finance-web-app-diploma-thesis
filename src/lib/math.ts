import { differenceInMonths } from "date-fns";

export function calculateMonthlyTarget(targetAmount: number, currentAmount: number, startDate: Date, deadline: Date) {
  const leftToSave = targetAmount - currentAmount;
  if (leftToSave <= 0) return 0;

  const months = differenceInMonths(deadline, startDate);
  const divisor = months > 0 ? months : 1;
  return leftToSave / divisor;
}