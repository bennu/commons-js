/**
 * @bennu-cl/commons-js
 *
 * Common utilities for JavaScript/TypeScript projects
 * Includes Chilean RUT validation and password strength validation
 *
 * @author Created by Bennu
 * @license MIT
 */

// Password Validator exports - Only core functions and essential types
export {
  // Core validation function (contains all utilities)
  validatePassword,
  // Password matching functions
  validatePasswordMatch,
  passwordsMatch,
  
  // Essential types for TypeScript users
  SecurityLevel,
  ValidationResult,
  ValidationError,
  ValidationErrorType,
  PasswordMatchResult,
  LengthConfig,
} from "./password-validator/password-validator"

// Chilean RUT Validator exports
export {
  isValidRut,
  cleanRut,
  calculateVerificationDigit,
  RutValidationResult,
} from "./validate-chilean-rut"

// Two-Factor Authentication exports
export {
  generateMinutelyTwoFactor,
} from "./two-factor-generator/two-factor-generator"

// Package info
export const version = "0.3.0"
export const author = "Bennu"
export const license = "MIT"

export const validators = {
  rut: "Chilean RUT (Rol Único Tributario) validation",
  password: "Password strength validation with built-in utilities and typed error system",
  twoFactor: "Time-based two-factor authentication code generation",
} as const