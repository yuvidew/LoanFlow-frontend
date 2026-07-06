import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formats a number as currency in Indian Rupees (INR) with no decimal places.
export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);

// Formats a string token by converting it to title case and replacing underscores with spaces.
export const formatToken = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

// Calculates the age of a person based on their date of birth. The dateOfBirth parameter should be a string in a format that can be parsed by the Date constructor (e.g., "YYYY-MM-DD"). The function returns the age as a number.
export const calculateAge = (dateOfBirth: string) => {
  const birthDate = new Date(dateOfBirth);
  const ageDiff = Date.now() - birthDate.getTime();
  return Math.floor(ageDiff / 31557600000);
};