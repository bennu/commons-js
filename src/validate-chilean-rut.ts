/**
 * Chilean RUT Validator
 *
 * A TypeScript implementation to validate Chilean RUT numbers.
 *
 * @author Created by Bennu
 * @license MIT
 */

/**
 * Interface for validation result returned by validateRut
 */
export interface RutValidationResult {
  isValid: boolean;
  formatted: string | null;
  raw: string;
  rutNumber?: string;
  verificationDigit?: string;
}

/**
 * Safely converts input to string and cleans a RUT by removing formatting characters
 *
 * @param rut - RUT input to clean
 * @returns Cleaned RUT string
 */
export function cleanRut(rut: unknown): string {
  if (rut === null || rut === undefined) {
    return ''
  }

  let rutString: string
  try {
    rutString = String(rut)
  } catch (e) {
    return ''
  }

  return rutString.replace(/[.-\s]/g, '').toUpperCase()
}

/**
 * Calculates the verification digit for a given RUT
 *
 * @param rutNumber - RUT number without verification digit
 * @returns Calculated verification digit
 */
export function calculateVerificationDigit(rutNumber: string | number): string {
  // Convert to string safely
  const rutString = String(rutNumber)

  if (!/^\d+$/.test(rutString)) {
    return ''
  }

  if (rutString.length > 20) {
    return ''
  }

  const rutDigits = rutString.split('').reverse()
  const multipliers = [2, 3, 4, 5, 6, 7, 2, 3, 4, 5, 6, 7]

  let sum = 0
  for (let i = 0; i < rutDigits.length; i++) {
    sum += parseInt(rutDigits[i], 10) * multipliers[i % multipliers.length]
  }

  const remainder = sum % 11
  const verificationDigit = 11 - remainder

  if (verificationDigit === 11) return '0'
  if (verificationDigit === 10) return 'K'
  return String(verificationDigit)
}

/**
 * Validates if a given string is a valid Chilean RUT
 *
 * @param rut - RUT to validate
 * @param requireVerificationDigit - Deprecated parameter, kept for backward compatibility. Ambiguous RUTs are always rejected. Default: false
 * @returns True if the RUT is valid, false otherwise
 */
export function isValidRut(rut: unknown, requireVerificationDigit: boolean = false): boolean {
  try {
    // Check for malformed RUTs with invalid separator patterns (before cleaning)
    const rutString = String(rut)
    if (/--/.test(rutString) || /\.\./.test(rutString) || /\.-/.test(rutString) || /-\./.test(rutString)) {
      return false
    }

    const cleanedRut = cleanRut(rut)

    if (cleanedRut.length < 2) return false

    if (cleanedRut.length > 20) return false

    const rutRegex = /^(\d+)([K\d])$/
    if (!rutRegex.test(cleanedRut)) return false

    const match = cleanedRut.match(rutRegex)
    if (!match || match.length !== 3) return false

    const rutNumber = match[1]
    const providedVerificationDigit = match[2]

    if (rutNumber.length > 20) return false

    const calculatedVerificationDigit = calculateVerificationDigit(rutNumber)

    if (!calculatedVerificationDigit) return false

    // Check if this is an ambiguous RUT (small RUT number without separator)
    // This prevents edge cases where the last digit of the RUT number coincidentally matches the verification digit
    const hasSeparator = /[-.]/.test(rutString)

    // If no separator, the RUT number must be longer than 7 digits to be valid
    // This prevents cases like '19713741' where '1971374' (7 digits) + '1' (verification digit)
    // could be confused with just the number '19713741'
    // This ambiguity makes it unsafe to accept such RUTs unless they have explicit separators
    if (!hasSeparator && rutNumber.length <= 7) {
      // For RUT numbers with 7 or fewer digits without separators, always reject as ambiguous
      return false
    }

    // If requireVerificationDigit is true, we've already ensured the separator or long number above
    // So we just validate the check digit matches
    return calculatedVerificationDigit === providedVerificationDigit
  } catch (e) {
    return false
  }
}

/**
 * Formats a valid RUT with proper formatting (dots and hyphen)
 *
 * @param rut - RUT to format
 * @param requireVerificationDigit - If true, requires an explicit verification digit. Default: false
 * @returns Formatted RUT string or null if invalid
 */
export function formatRut(rut: unknown, requireVerificationDigit: boolean = false): string | null {
  if (!isValidRut(rut, requireVerificationDigit)) {
    return null
  }

  const cleanedRut = cleanRut(rut)
  const match = cleanedRut.match(/^(\d+)([K\d])$/)

  if (!match || match.length !== 3) {
    return null
  }

  const rutNumber = match[1]
  const verificationDigit = match[2]

  // Format: XX.XXX.XXX-D
  const parts: string[] = []
  let remaining = rutNumber

  // Extract last 3 digits
  if (remaining.length > 3) {
    parts.unshift(remaining.slice(-3))
    remaining = remaining.slice(0, -3)
  } else {
    parts.unshift(remaining)
    remaining = ''
  }

  // Extract middle groups of 3
  while (remaining.length > 3) {
    parts.unshift(remaining.slice(-3))
    remaining = remaining.slice(0, -3)
  }

  // Add remaining digits
  if (remaining) {
    parts.unshift(remaining)
  }

  return parts.join('.') + '-' + verificationDigit
}

/**
 * Validates a RUT and returns detailed information about it
 *
 * @param rut - RUT to validate
 * @param requireVerificationDigit - If true, requires an explicit verification digit. Default: false
 * @returns RutValidationResult object with validation information
 */
export function validateRut(rut: unknown, requireVerificationDigit: boolean = false): RutValidationResult {
  const cleanedRut = cleanRut(rut)
  const isValid = isValidRut(rut, requireVerificationDigit)

  if (!isValid) {
    return {
      isValid: false,
      formatted: null,
      raw: cleanedRut
    }
  }

  const match = cleanedRut.match(/^(\d+)([K\d])$/)

  if (!match || match.length !== 3) {
    return {
      isValid: false,
      formatted: null,
      raw: cleanedRut
    }
  }

  const rutNumber = match[1]
  const verificationDigit = match[2]
  const formatted = formatRut(rut, requireVerificationDigit)

  return {
    isValid: true,
    formatted,
    raw: cleanedRut,
    rutNumber,
    verificationDigit
  }
}
