"use strict";
/**
 * Chilean RUT Validator
 *
 * A TypeScript implementation to validate Chilean RUT numbers.
 *
 * @author Created by Bennu
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanRut = cleanRut;
exports.calculateVerificationDigit = calculateVerificationDigit;
exports.isValidRut = isValidRut;
/**
 * Safely converts input to string and cleans a RUT by removing formatting characters
 *
 * @param rut - RUT input to clean
 * @returns Cleaned RUT string
 */
function cleanRut(rut) {
    if (rut === null || rut === undefined) {
        return '';
    }
    let rutString;
    try {
        rutString = String(rut);
    }
    catch (e) {
        return '';
    }
    return rutString.replace(/[.-\s]/g, '').toUpperCase();
}
/**
 * Calculates the verification digit for a given RUT
 *
 * @param rutNumber - RUT number without verification digit
 * @returns Calculated verification digit
 */
function calculateVerificationDigit(rutNumber) {
    // Convert to string safely
    const rutString = String(rutNumber);
    if (!/^\d+$/.test(rutString)) {
        return '';
    }
    if (rutString.length > 20) {
        return '';
    }
    const rutDigits = rutString.split('').reverse();
    const multipliers = [2, 3, 4, 5, 6, 7, 2, 3, 4, 5, 6, 7];
    let sum = 0;
    for (let i = 0; i < rutDigits.length; i++) {
        sum += parseInt(rutDigits[i], 10) * multipliers[i % multipliers.length];
    }
    const remainder = sum % 11;
    const verificationDigit = 11 - remainder;
    if (verificationDigit === 11)
        return '0';
    if (verificationDigit === 10)
        return 'K';
    return String(verificationDigit);
}
/**
 * Validates if a given string is a valid Chilean RUT
 *
 * @param rut - RUT to validate
 * @returns True if the RUT is valid, false otherwise
 */
function isValidRut(rut) {
    try {
        const cleanedRut = cleanRut(rut);
        if (cleanedRut.length < 2)
            return false;
        if (cleanedRut.length > 20)
            return false;
        const rutRegex = /^(\d+)([K\d])$/;
        if (!rutRegex.test(cleanedRut))
            return false;
        const match = cleanedRut.match(rutRegex);
        if (!match || match.length !== 3)
            return false;
        const rutNumber = match[1];
        const providedVerificationDigit = match[2];
        if (rutNumber.length > 20)
            return false;
        const calculatedVerificationDigit = calculateVerificationDigit(rutNumber);
        if (!calculatedVerificationDigit)
            return false;
        return calculatedVerificationDigit === providedVerificationDigit;
    }
    catch (e) {
        return false;
    }
}
