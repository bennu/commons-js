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
 * Formats a RUT string to standard Chilean format (XX.XXX.XXX-X)
 *
 * @param rut - RUT to format
 * @returns Formatted RUT string or null if invalid
 */
export function formatRut(rut: unknown): string | null {
  const cleanedRut = cleanRut(rut)
  if (!isValidRut(cleanedRut)) {
    return null
  }

  if (!cleanedRut) {
    return null
  }

  const rutDigits = cleanedRut.slice(0, -1)
  const verificationDigit = cleanedRut.slice(-1)

  let formattedRut = ''
  let counter = 0

  for (let i = rutDigits.length - 1; i >= 0; i--) {
    formattedRut = rutDigits[i] + formattedRut
    counter++

    if (counter === 3 && i !== 0) {
      formattedRut = '.' + formattedRut
      counter = 0
    }
  }

  return `${formattedRut}-${verificationDigit}`
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
 * @returns True if the RUT is valid, false otherwise
 */
export function isValidRut(rut: unknown): boolean {
  try {
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

    return calculatedVerificationDigit === providedVerificationDigit
  } catch (e) {
    return false
  }
}

/**
 * Returns detailed validation information for a RUT
 *
 * @param rut - RUT to validate
 * @returns Validation information
 */
export function validateRut(rut: unknown): RutValidationResult {
  try {
    const cleanedRut = cleanRut(rut)
    const isValid = isValidRut(cleanedRut)

    if (!isValid) {
      return {
        isValid: false,
        formatted: null,
        raw: cleanedRut
      }
    }

    const rutRegex = /^(\d+)([K\d])$/
    const match = cleanedRut.match(rutRegex)

    if (!match || match.length !== 3) {
      return {
        isValid: false,
        formatted: null,
        raw: cleanedRut
      }
    }

    const rutNumber = match[1]
    const verificationDigit = match[2]

    return {
      isValid: true,
      formatted: formatRut(cleanedRut),
      raw: cleanedRut,
      rutNumber,
      verificationDigit
    }
  } catch (e) {
    return {
      isValid: false,
      formatted: null,
      raw: String(rut)
    }
  }
}
