/**
 * @bennu-cl/commons-js
 *
 * Common utilities for JavaScript/TypeScript projects
 * Includes Chilean RUT validation and password strength validation
 *
 * @author Created by Bennu
 * @license MIT
 */

// Password Validator exports
export {
  SecurityLevel,
  ValidationResult,
  ValidationError,
  ValidationErrorType,
  PasswordMatchResult,
  LengthConfig,
  validatePassword,
  isValidPassword,
  validatePasswordMatch,
  passwordsMatch,
  hasErrorType,
  getErrorsByType,
  getCustomErrorMessages,
} from "./password-validator/password-validator"

// Chilean RUT Validator exports
export {
  isValidRut,
  cleanRut,
  calculateVerificationDigit,
  RutValidationResult,
} from "./validate-chilean-rut"

// Package info
export const version = "0.3.0"
export const author = "Bennu"
export const license = "MIT"

export const validators = {
  rut: "Chilean RUT (Rol Único Tributario) validation",
  password:
    "Password strength validation with typed error system and security levels",
} as const
