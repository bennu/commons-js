/**
 * Simplified Password Validator
 * @author Created by Bennu ❤️
 * @license MIT
 */

export type SecurityLevel = "low" | "medium" | "high"

export interface ValidationResult {
  isValid: boolean
  missing: string[]
  level: SecurityLevel
}

export interface PasswordMatchResult {
  isMatch: boolean
  error: string | null
}

const LEVEL_REQUIREMENTS = {
  low: {
    minLength: 6,
    maxLength: 64,
    requireUppercase: false,
    requireLowercase: false,
    requireNumber: false,
    requireSymbol: false,
    allowOnlyAlphanumeric: true,
  },
  medium: {
    minLength: 8,
    maxLength: 64,
    requireUppercase: true,
    requireLowercase: false,
    requireNumber: false,
    requireSymbol: false,
    allowOnlyAlphanumeric: true,
  },
  high: {
    minLength: 12,
    maxLength: 64,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSymbol: true,
    allowOnlyAlphanumeric: false,
  },
} as const

/**
 * Clean and validate password input
 */
function cleanPassword(password: unknown): string {
  if (password === null || password === undefined) return ""
  return String(password).trim()
}

/**
 * Check if password has repeated characters (3+ consecutive)
 */
function hasRepeatedChars(password: string): boolean {
  return /(.)\1{2,}/.test(password)
}

/**
 * Validate password against security level requirements
 */
export function validatePassword(
  password: unknown,
  level: SecurityLevel = "medium"
): ValidationResult {
  const cleanedPassword = cleanPassword(password)
  const requirements = LEVEL_REQUIREMENTS[level]
  const missing: string[] = []

  if (!cleanedPassword) {
    return {
      isValid: false,
      missing: ["Password cannot be empty"],
      level,
    }
  }

  // Length checks
  if (cleanedPassword.length < requirements.minLength) {
    missing.push(`At least ${requirements.minLength} characters`)
  }
  if (cleanedPassword.length > requirements.maxLength) {
    missing.push(`Maximum ${requirements.maxLength} characters`)
  }

  // Character type checks
  const hasUppercase = /[A-Z]/.test(cleanedPassword)
  const hasLowercase = /[a-z]/.test(cleanedPassword)
  const hasNumber = /[0-9]/.test(cleanedPassword)
  const hasSymbol = /[!@#$%^&*()_+[\]{};':"\\|,.<>/?`~\-=]/.test(
    cleanedPassword
  )
  const isAlphanumeric = /^[a-zA-Z0-9]+$/.test(cleanedPassword)

  if (requirements.requireUppercase && !hasUppercase) {
    missing.push("At least one uppercase letter")
  }
  if (requirements.requireLowercase && !hasLowercase) {
    missing.push("At least one lowercase letter")
  }
  if (requirements.requireNumber && !hasNumber) {
    missing.push("At least one number")
  }
  if (requirements.requireSymbol && !hasSymbol) {
    missing.push("At least one symbol")
  }

  // Alphanumeric only check for low/medium levels
  if (requirements.allowOnlyAlphanumeric && !isAlphanumeric) {
    missing.push("Only letters and numbers allowed")
  }

  // Repeated characters check
  if (hasRepeatedChars(cleanedPassword)) {
    missing.push("No repeated characters (3+ consecutive)")
  }

  return {
    isValid: missing.length === 0,
    missing,
    level,
  }
}

/**
 * Simple boolean check for password strength
 */
export function isValidPassword(
  password: unknown,
  level: SecurityLevel = "medium"
): boolean {
  return validatePassword(password, level).isValid
}

/**
 * Validate if two passwords match
 */
export function validatePasswordMatch(
  password1: unknown,
  password2: unknown
): PasswordMatchResult {
  const cleaned1 = cleanPassword(password1)
  const cleaned2 = cleanPassword(password2)

  const isMatch = cleaned1 === cleaned2 && cleaned1.length > 0

  return {
    isMatch,
    error: isMatch ? null : "Passwords do not match",
  }
}

/**
 * Simple boolean check for password matching
 */
export function passwordsMatch(
  password1: unknown,
  password2: unknown
): boolean {
  return validatePasswordMatch(password1, password2).isMatch
}
