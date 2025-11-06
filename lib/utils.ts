import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function createNPId(number: number): string {
  // Handle negative numbers by taking absolute value
  const absoluteNumber = Math.abs(number);

  // Convert to string and pad with leading zeros to make it 3 digits
  const paddedNumber = absoluteNumber.toString().padStart(4, "0");

  // Return with NP prefix
  return `GALA${paddedNumber}`;
}

export function extractNumberFromNPId(npId: string): number {
  // Remove "NP" prefix and convert to number
  const numberStr = npId.replace(/^GALA/i, ""); // case-insensitive removal

  // Convert to number and return
  const number = parseInt(numberStr, 10);

  // Handle NaN cases
  if (isNaN(number)) {
    throw new Error(`Invalid NP ID format: ${npId}`);
  }

  return number;
}
