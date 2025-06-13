/**
 * @bennu-cl/commons-js
 * 
 * Common utilities for JavaScript/TypeScript projects
 * Includes Chilean RUT validation and password strength validation
 * 
 * @author Created by Bennu
 * @license MIT
 */

// =============================================================================
// CHILEAN RUT VALIDATOR
// =============================================================================

/**
 * Chilean RUT Validator exports
 */
export {
  isValidRut,
  cleanRut,
  calculateVerificationDigit,
  RutValidationResult
} from './validate-chilean-rut'

// =============================================================================
// PASSWORD VALIDATOR
// =============================================================================

/**
 * Password Validator exports
 */
export {
  PasswordValidationConfig,
  PasswordValidationResult,
  PasswordMatchResult,
  validatePasswordMatch,
  
  // Additional core functions
  isStrongPassword,
  validatePasswordStrength,
  passwordsMatch,
  cleanPassword,
  calculatePasswordStrength,
  
  // Angular Forms compatible validators
  createStrongPasswordValidator,
  createPasswordMatchValidator,
  
  // Default configuration
  defaultPasswordConfig
} from './password-validator'

// =============================================================================
// PACKAGE INFO
// =============================================================================

/**
 * Package version and metadata
 */
export const version = '0.0.1'
export const author = 'Bennu'
export const license = 'MIT'

/**
 * Available validators in this package
 */
export const validators = {
  rut: 'Chilean RUT (Rol Único Tributario) validation',
  password: 'Password strength validation with configurable rules'
} as const