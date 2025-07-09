/**
 * Two-Factor Authentication Code Generator
 * Generates time-based codes that match backend implementation
 * @author Created by Bennu ❤️
 * @license MIT
 */

/**
 * Generate a time-based two-factor authentication code
 * Uses current date/time in Santiago timezone with a multiplier algorithm
 * to match backend implementation
 */
export function generateMinutelyTwoFactor(length: number = 4): string {
  if (length < 4 || length > 8) {
    throw new Error("Length must be between 4 and 8.")
  }

  // Formato "yyyyMMddHHmm" en timezone America/Santiago
  const now = new Date().toLocaleString("en-CA", {
    timeZone: "America/Santiago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).replace(/[-:, ]/g, '')

  const multiplier = 97
  const addend = 31

  const value = parseInt(now)
  const mixed = (value * multiplier + addend)

  const result = mixed.toString()

  if (result.length < length) {
    return result.padStart(length, '0')
  }

  return result.substring(result.length - length)
}