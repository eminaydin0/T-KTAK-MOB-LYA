import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Tailwind sınıflarını birleştirir; çakışan utility'lerde son değer kazanır. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
