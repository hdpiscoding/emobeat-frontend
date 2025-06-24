import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { setDate, setMonth, setYear} from "date-fns"

export const updateDatePart = (month: Date, newDay: Date): Date => {
  let updatedDate = setDate(month, newDay.getDate());
  updatedDate = setMonth(updatedDate, newDay.getMonth());
  updatedDate = setYear(updatedDate, newDay.getFullYear());
  return updatedDate;};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
