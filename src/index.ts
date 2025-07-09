/**
 * Chilean RUT Validator
 * A TypeScript package to validate Chilean RUT (Rol Único Tributario) numbers.
 */

export {
  isValidRut,
  cleanRut,
  calculateVerificationDigit,
  RutValidationResult
} from './validate-chilean-rut' 

/**
 * Two Factor Authentication Code(2FA)
 * A TypeScript package to generate  2FA codes.
 */

export {
  generateMinutelyTwoFactor,
} from "./two-factor-generator/two-factor-generator"
