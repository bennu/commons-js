/**
 * Simplified Password Validator
 * @author Created by Bennu ❤️
 * @license MIT
 */

export type SecurityLevel = "low" | "medium" | "high"

export enum ValidationErrorType {
  EMPTY = "EMPTY",
  TOO_SHORT = "TOO_SHORT",
  TOO_LONG = "TOO_LONG",
  MISSING_UPPERCASE = "MISSING_UPPERCASE",
  MISSING_LOWERCASE = "MISSING_LOWERCASE",
  MISSING_NUMBER = "MISSING_NUMBER",
  MISSING_SYMBOL = "MISSING_SYMBOL",
  NOT_ALPHANUMERIC = "NOT_ALPHANUMERIC",
  REPEATED_CHARS = "REPEATED_CHARS",
  NON_STRING_INPUT = "NON_STRING_INPUT",
}

export interface ValidationError {
  type: ValidationErrorType
  message: string
  expectedValue?: number | string
  actualValue?: number | string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  level: SecurityLevel
  /** @deprecated Use errors instead. Will be removed in v1.0 */
  missing: string[]

  // Built-in utility methods
  hasErrorType(errorType: ValidationErrorType): boolean
  getErrorsByType(errorType: ValidationErrorType): ValidationError[]
  getCustomErrorMessages(
    customMessages: Partial<Record<ValidationErrorType, string>>
  ): string[]
}

export interface PasswordMatchResult {
  isMatch: boolean
  error: string | null
}

export interface LengthConfig {
  low?: number
  medium?: number
  high?: number
}

const DEFAULT_MIN_LENGTHS = {
  low: 6,
  medium: 8,
  high: 12,
} as const

const DEFAULT_ERROR_MESSAGES: Record<ValidationErrorType, string> = {
  [ValidationErrorType.EMPTY]: "Password cannot be empty",
  [ValidationErrorType.TOO_SHORT]: "Password is too short",
  [ValidationErrorType.TOO_LONG]: "Password is too long",
  [ValidationErrorType.MISSING_UPPERCASE]:
    "At least one uppercase letter required",
  [ValidationErrorType.MISSING_LOWERCASE]:
    "At least one lowercase letter required",
  [ValidationErrorType.MISSING_NUMBER]: "At least one number required",
  [ValidationErrorType.MISSING_SYMBOL]: "At least one symbol required",
  [ValidationErrorType.NOT_ALPHANUMERIC]: "Only letters and numbers allowed",
  [ValidationErrorType.REPEATED_CHARS]:
    "No repeated characters (3+ consecutive)",
  [ValidationErrorType.NON_STRING_INPUT]: "Input must be a string",
}

const BASE_LEVEL_REQUIREMENTS = {
  low: {
    maxLength: 64,
    requireUppercase: false,
    requireLowercase: false,
    requireNumber: false,
    requireSymbol: false,
    allowOnlyAlphanumeric: true,
  },
  medium: {
    maxLength: 64,
    requireUppercase: true,
    requireLowercase: false,
    requireNumber: false,
    requireSymbol: false,
    allowOnlyAlphanumeric: true,
  },
  high: {
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
function createValidationResult(
  isValid: boolean,
  errors: ValidationError[],
  level: SecurityLevel
): ValidationResult {
  return {
    isValid,
    errors,
    level,
    missing: errors.map((e) => e.message), // Backward compatibility

    // Built-in utility methods
    hasErrorType(errorType: ValidationErrorType): boolean {
      return errors.some((error) => error.type === errorType)
    },

    getErrorsByType(errorType: ValidationErrorType): ValidationError[] {
      return errors.filter((error) => error.type === errorType)
    },

    getCustomErrorMessages(
      customMessages: Partial<Record<ValidationErrorType, string>>
    ): string[] {
      return errors.map((error) => customMessages[error.type] || error.message)
    },
  }
}
function createError(
  type: ValidationErrorType,
  expectedValue?: number | string,
  actualValue?: number | string,
  customMessage?: string
): ValidationError {
  return {
    type,
    message: customMessage || DEFAULT_ERROR_MESSAGES[type],
    expectedValue,
    actualValue,
  }
}

/**
 * Get level requirements with custom min lengths
 */
function getLevelRequirements(
  level: SecurityLevel,
  customLengths?: LengthConfig
) {
  const baseRequirements = BASE_LEVEL_REQUIREMENTS[level]
  const minLength = customLengths?.[level] ?? DEFAULT_MIN_LENGTHS[level]

  return {
    ...baseRequirements,
    minLength,
  }
}

/**
 * Validate password against security level requirements
 */
export function validatePassword(
  password: unknown,
  level: SecurityLevel = "medium",
  customLengths?: LengthConfig
): ValidationResult {
  // Check if input is a valid string first
  if (typeof password !== "string") {
    const error = createError(ValidationErrorType.NON_STRING_INPUT)
    return createValidationResult(false, [error], level)
  }

  const cleanedPassword = cleanPassword(password)
  const requirements = getLevelRequirements(level, customLengths)
  const errors: ValidationError[] = []

  if (!cleanedPassword) {
    const error = createError(ValidationErrorType.EMPTY)
    return createValidationResult(false, [error], level)
  }

  // Length checks
  if (cleanedPassword.length < requirements.minLength) {
    errors.push(
      createError(
        ValidationErrorType.TOO_SHORT,
        requirements.minLength,
        cleanedPassword.length,
        `At least ${requirements.minLength} characters`
      )
    )
  }
  if (cleanedPassword.length > requirements.maxLength) {
    errors.push(
      createError(
        ValidationErrorType.TOO_LONG,
        requirements.maxLength,
        cleanedPassword.length,
        `Maximum ${requirements.maxLength} characters`
      )
    )
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
    errors.push(
      createError(
        ValidationErrorType.MISSING_UPPERCASE,
        undefined,
        undefined,
        "At least one uppercase letter"
      )
    )
  }
  if (requirements.requireLowercase && !hasLowercase) {
    errors.push(
      createError(
        ValidationErrorType.MISSING_LOWERCASE,
        undefined,
        undefined,
        "At least one lowercase letter"
      )
    )
  }
  if (requirements.requireNumber && !hasNumber) {
    errors.push(
      createError(
        ValidationErrorType.MISSING_NUMBER,
        undefined,
        undefined,
        "At least one number"
      )
    )
  }
  if (requirements.requireSymbol && !hasSymbol) {
    errors.push(
      createError(
        ValidationErrorType.MISSING_SYMBOL,
        undefined,
        undefined,
        "At least one symbol"
      )
    )
  }

  // Alphanumeric only check for low/medium levels
  if (requirements.allowOnlyAlphanumeric && !isAlphanumeric) {
    errors.push(
      createError(
        ValidationErrorType.NOT_ALPHANUMERIC,
        undefined,
        undefined,
        "Only letters and numbers allowed"
      )
    )
  }

  // Repeated characters check
  if (hasRepeatedChars(cleanedPassword)) {
    errors.push(createError(ValidationErrorType.REPEATED_CHARS))
  }

  return createValidationResult(errors.length === 0, errors, level)
}

/**
 * Simple boolean check for password validity
 */
export function isValidPassword(
  password: unknown,
  level: SecurityLevel = "medium",
  customLengths?: LengthConfig
): boolean {
  return validatePassword(password, level, customLengths).isValid
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
