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
export declare function cleanRut(rut: unknown): string;
/**
 * Calculates the verification digit for a given RUT
 *
 * @param rutNumber - RUT number without verification digit
 * @returns Calculated verification digit
 */
export declare function calculateVerificationDigit(rutNumber: string | number): string;
/**
 * Validates if a given string is a valid Chilean RUT
 *
 * @param rut - RUT to validate
 * @returns True if the RUT is valid, false otherwise
 */
export declare function isValidRut(rut: unknown): boolean;
