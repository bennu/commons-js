/**
 * Password Validator
 *
 * A TypeScript implementation to validate passwords with configurable rules
 * and password confirmation matching.
 *
 * @author Created by Bennu ❤️
 * @license MIT
 */

/**
 * Configuration options for password validation
 */
export interface PasswordValidationConfig {
  /** Minimum password length (default: 12) */
  minLength?: number
  /** Maximum password length (default: 64) */
  maxLength?: number
  /** Require at least one uppercase letter (default: true) */
  requireUppercase?: boolean
  /** Require at least one lowercase letter (default: true) */
  requireLowercase?: boolean
  /** Require at least one number (default: true) */
  requireNumber?: boolean
  /** Require at least one symbol (default: true) */
  requireSymbol?: boolean
  /** Custom symbol pattern (default: standard symbols) */
  symbolPattern?: RegExp
}

/**
 * Interface for password validation result
 */
export interface PasswordValidationResult {
  /** Whether the password is valid */
  isValid: boolean
  /** Array of validation errors */
  errors: string[]
  /** Password strength score (0-100) */
  strength: number
  /** Raw password input */
  raw: string
  /** Validation details */
  checks: {
    hasMinLength: boolean
    hasMaxLength: boolean
    hasUppercase: boolean
    hasLowercase: boolean
    hasNumber: boolean
    hasSymbol: boolean
  }
}

/**
 * Interface for password match validation result
 */
export interface PasswordMatchResult {
  /** Whether passwords match */
  isMatch: boolean
  /** Error message if passwords don't match */
  error: string | null
  /** First password (cleaned) */
  password1: string
  /** Second password (cleaned) */
  password2: string
}

/**
 * Default password validation configuration
 */
const DEFAULT_CONFIG: Required<PasswordValidationConfig> = {
  minLength: 12,
  maxLength: 64,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSymbol: true,
  symbolPattern: /[!@#$%^&*()_+[\]{};':"\\|,.<>/?`~\-=]/
}

/**
 * Safely converts input to string and cleans password input
 *
 * @param password - Password input to clean
 * @returns Cleaned password string
 */
export function cleanPassword(password: unknown): string {
  if (password === null || password === undefined) {
    return ''
  }

  let passwordString: string
  try {
    passwordString = String(password)
  } catch (e) {
    return ''
  }

  // Remove leading/trailing whitespace but preserve internal spaces
  return passwordString.trim()
}

/**
 * Calculates password strength score based on various criteria
 *
 * @param password - Password to analyze
 * @param config - Validation configuration
 * @returns Strength score from 0 to 100
 */
export function calculatePasswordStrength(
  password: string,
  config: PasswordValidationConfig = {}
): number {
  const cleanedPassword = cleanPassword(password)
  if (!cleanedPassword) return 0

  const mergedConfig = { ...DEFAULT_CONFIG, ...config }
  let score = 0

  // Length scoring (40 points max)
  const lengthScore = Math.min(40, (cleanedPassword.length / mergedConfig.maxLength) * 40)
  score += lengthScore

  // Character variety scoring (60 points max)
  const hasUppercase = /[A-Z]/.test(cleanedPassword)
  const hasLowercase = /[a-z]/.test(cleanedPassword)
  const hasNumber = /[0-9]/.test(cleanedPassword)
  const hasSymbol = mergedConfig.symbolPattern.test(cleanedPassword)

  if (hasUppercase) score += 15
  if (hasLowercase) score += 15
  if (hasNumber) score += 15
  if (hasSymbol) score += 15

  // Bonus for character diversity
  const uniqueChars = new Set(cleanedPassword).size
  const diversityBonus = Math.min(10, (uniqueChars / cleanedPassword.length) * 10)
  score += diversityBonus

  // Penalty for common patterns
  if (/(.)\1{2,}/.test(cleanedPassword)) score -= 10 // Repeated characters
  if (/123|abc|qwe|asd|zxc/i.test(cleanedPassword)) score -= 15 // Sequential patterns
  if (/password|123456|qwerty|admin|login/i.test(cleanedPassword)) score -= 25 // Common words

  return Math.max(0, Math.min(100, Math.round(score)))
}

/**
 * Validates password strength based on configurable criteria
 *
 * @param password - Password to validate
 * @param config - Optional validation configuration
 * @returns Detailed validation result
 */
export function validatePasswordStrength(
  password: unknown,
  config: PasswordValidationConfig = {}
): PasswordValidationResult {
  const cleanedPassword = cleanPassword(password)
  const mergedConfig = { ...DEFAULT_CONFIG, ...config }
  const errors: string[] = []

  // Basic checks
  const hasMinLength = cleanedPassword.length >= mergedConfig.minLength
  const hasMaxLength = cleanedPassword.length <= mergedConfig.maxLength
  const hasUppercase = /[A-Z]/.test(cleanedPassword)
  const hasLowercase = /[a-z]/.test(cleanedPassword)
  const hasNumber = /[0-9]/.test(cleanedPassword)
  const hasSymbol = mergedConfig.symbolPattern.test(cleanedPassword)

  // Collect validation errors
  if (!hasMinLength) {
    errors.push(`Password must be at least ${mergedConfig.minLength} characters long`)
  }
  if (!hasMaxLength) {
    errors.push(`Password must not exceed ${mergedConfig.maxLength} characters`)
  }
  if (mergedConfig.requireUppercase && !hasUppercase) {
    errors.push('Password must contain at least one uppercase letter')
  }
  if (mergedConfig.requireLowercase && !hasLowercase) {
    errors.push('Password must contain at least one lowercase letter')
  }
  if (mergedConfig.requireNumber && !hasNumber) {
    errors.push('Password must contain at least one number')
  }
  if (mergedConfig.requireSymbol && !hasSymbol) {
    errors.push('Password must contain at least one symbol')
  }

  const isValid = errors.length === 0
  const strength = calculatePasswordStrength(cleanedPassword, config)

  return {
    isValid,
    errors,
    strength,
    raw: String(password || ''),
    checks: {
      hasMinLength,
      hasMaxLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSymbol
    }
  }
}

/**
 * Validates if a password meets strength requirements (simple boolean check)
 *
 * @param password - Password to validate
 * @param config - Optional validation configuration
 * @returns True if password is strong enough, false otherwise
 */
export function isStrongPassword(
  password: unknown,
  config: PasswordValidationConfig = {}
): boolean {
  try {
    const result = validatePasswordStrength(password, config)
    return result.isValid
  } catch (e) {
    return false
  }
}

/**
 * Validates if two passwords match
 *
 * @param password1 - First password
 * @param password2 - Second password (confirmation)
 * @returns Password match validation result
 */
export function validatePasswordMatch(
  password1: unknown,
  password2: unknown
): PasswordMatchResult {
  try {
    const cleanedPassword1 = cleanPassword(password1)
    const cleanedPassword2 = cleanPassword(password2)

    const isMatch = cleanedPassword1 === cleanedPassword2
    const error = isMatch ? null : 'Passwords do not match'

    return {
      isMatch,
      error,
      password1: cleanedPassword1,
      password2: cleanedPassword2
    }
  } catch (e) {
    return {
      isMatch: false,
      error: 'Error validating password match',
      password1: '',
      password2: ''
    }
  }
}

/**
 * Simple boolean check if two passwords match
 *
 * @param password1 - First password
 * @param password2 - Second password (confirmation)
 * @returns True if passwords match, false otherwise
 */
export function passwordsMatch(password1: unknown, password2: unknown): boolean {
  try {
    const result = validatePasswordMatch(password1, password2)
    return result.isMatch
  } catch (e) {
    return false
  }
}

/**
 * Angular Forms compatible validator for password strength
 * Returns null if valid, validation error object if invalid
 *
 * @param config - Optional validation configuration
 * @returns Angular validator function
 */
export function createStrongPasswordValidator(config: PasswordValidationConfig = {}) {
  return (control: any): { [key: string]: any } | null => {
    const result = validatePasswordStrength(control?.value, config)
    return result.isValid ? null : { weakPassword: { errors: result.errors, strength: result.strength } }
  }
}

/**
 * Angular Forms compatible validator for password matching
 * Returns null if valid, validation error object if invalid
 *
 * @param password1Field - Name of first password field (default: 'password')
 * @param password2Field - Name of second password field (default: 'confirmPassword')
 * @returns Angular validator function
 */
export function createPasswordMatchValidator(
  password1Field: string = 'password',
  password2Field: string = 'confirmPassword'
) {
  return (formGroup: any): { [key: string]: any } | null => {
    const password1 = formGroup.get?.(password1Field)?.value
    const password2 = formGroup.get?.(password2Field)?.value
    
    const result = validatePasswordMatch(password1, password2)
    return result.isMatch ? null : { passwordsMismatch: true }
  }
}

// Export default configuration for convenience
export { DEFAULT_CONFIG as defaultPasswordConfig }