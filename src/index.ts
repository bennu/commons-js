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
  PasswordMatchResult,
  validatePassword,
  isValidPassword,
  validatePasswordMatch,
  passwordsMatch,
} from "./password-validator/password-validator"

// Chilean RUT Validator exports (keep existing)
export {
  isValidRut,
  cleanRut,
  calculateVerificationDigit,
  RutValidationResult,
} from "./validate-chilean-rut"

// Package info
export const version = "0.1.0"
export const author = "Bennu"
export const license = "MIT"

export const validators = {
  rut: "Chilean RUT (Rol Único Tributario) validation",
  password: "Password strength validation with security levels",
} as const
