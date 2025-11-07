import {
  isValidRut,
  validateRut,
  formatRut,
  cleanRut,
  calculateVerificationDigit
} from '../src/validate-chilean-rut'

// Test data: valid RUTs
const validRuts = [
  '12.345.678-5',
  '12345678-5',
  '123456785',
  '7.654.316-K',
  '7654316-K',
  '1-9',
  '20.948.252-5',
  '19.713.741-K', // Valid RUT with separator (19713741 has K as verification digit)
  '19713741K' // Valid RUT without separator (8 digit RUT number, unambiguous)
]

// Test data: invalid RUTs
const invalidRuts = [
  '12.345.678-9', // Wrong verification digit (12345678 should end in 5)
  '7.654.321-1', // Wrong verification digit (7654321 should end in 6)
  'A12345678', // Contains letters in the number part
  '12345678A', // Contains letter in place of verification digit (not K)
  '', // Empty string
  '1', // Too short
  '1234567890K', // Too long
  '123456789', // Wrong check digit (should be 5, not 9)
  '12.345.678', // Missing verification digit
  '12.345.678-', // Missing verification digit
  '-5', // Missing RUT number
  '12345678-9K', // Multiple verification digits
  '12345678--5', // Multiple separators
  '12.345.678..5', // Incorrect format
  '19', // Ambiguous without separator (RUT number too small)
  '19713741' // Wrong check digit (1971374 should end in K, not 1) - also ambiguous without separator
]

const nonStringInputs: unknown[] = [
  null,
  undefined,
  {},
  [],
  123456789,
  true,
  Symbol('test')
]

describe('Chilean RUT Validator', () => {

  // Test cleanRut function
  describe('cleanRut', () => {
    test('should remove formatting characters', () => {
      expect(cleanRut('12.345.678-5')).toBe('123456785')
      expect(cleanRut('7.654.316-K')).toBe('7654316K')
      expect(cleanRut('1-9')).toBe('19')
    })

    test('should convert to uppercase', () => {
      expect(cleanRut('7.654.316-k')).toBe('7654316K')
    })

    test('should handle non-string inputs', () => {
      expect(cleanRut(12345678)).toBe('12345678')
      expect(cleanRut(null)).toBe('')
      expect(cleanRut(undefined)).toBe('')
      expect(cleanRut({})).toEqual(expect.any(String))
      expect(cleanRut([])).toEqual(expect.any(String))
    })
  })

  // Test calculateVerificationDigit function
  describe('calculateVerificationDigit', () => {
    test('should correctly calculate verification digit', () => {
      expect(calculateVerificationDigit('12345678')).toBe('5')
      expect(calculateVerificationDigit('7654316')).toBe('K')
      expect(calculateVerificationDigit('1')).toBe('9')
      expect(calculateVerificationDigit('20948252')).toBe('5')
    })

    test('should handle numeric input', () => {
      expect(calculateVerificationDigit(12345678)).toBe('5')
      expect(calculateVerificationDigit(7654316)).toBe('K')
    })

    test('should return empty string for invalid inputs', () => {
      expect(calculateVerificationDigit('ABC')).toBe('')
      expect(calculateVerificationDigit('12A34')).toBe('')
      expect(calculateVerificationDigit('1'.repeat(25))).toBe('')
    })
  })

  // Test isValidRut function
  describe('isValidRut', () => {
    test('should return true for valid RUTs', () => {
      validRuts.forEach((rut) => {
        if (!isValidRut(rut)) {
          console.log(`FAILED: RUT "${rut}" should be valid but was rejected`)
        }
        expect(isValidRut(rut)).toBe(true)
      })
    })

    test('should return false for invalid RUTs', () => {
      invalidRuts.forEach((rut) => {
        if (isValidRut(rut)) {
          console.log(`FAILED: RUT "${rut}" should be invalid but was accepted`)
        }
        expect(isValidRut(rut)).toBe(false)
      })
    })

    test('should handle non-string inputs', () => {
      nonStringInputs.forEach((input) => {
        expect(isValidRut(input)).toBe(false)
      })

      // A valid RUT as a number should work
      expect(isValidRut(123456785)).toBe(true)
    })

    test('should reject ambiguous RUTs (small RUT number without separator)', () => {
      // Edge case: short RUT without separator should always fail because it's ambiguous
      // '19713741' could be interpreted as '1971374' (RUT) + '1' (check digit)
      // or just the number '19713741'? With a separator it's unambiguous.
      expect(isValidRut('19713741')).toBe(false) // Ambiguous without separator
      expect(isValidRut(19713741)).toBe(false)
      expect(isValidRut('7654316K')).toBe(false) // RUT number is 7 digits - ambiguous without separator

      // But with separator it should pass
      expect(isValidRut('1971374-1')).toBe(true)
      expect(isValidRut('1.971.374-1')).toBe(true)
      expect(isValidRut('7654316-K')).toBe(true)
      expect(isValidRut('7.654.316-K')).toBe(true)

      // Valid RUTs with proper format should pass
      expect(isValidRut('12.345.678-5')).toBe(true)
      expect(isValidRut('12345678-5')).toBe(true)

      // Longer RUTs without separator should be accepted if unambiguous (RUT number > 7 digits)
      expect(isValidRut('123456785')).toBe(true) // RUT number: 12345678 (8 digits) - unambiguous
      expect(isValidRut('1234567850')).toBe(false) // Wrong check digit for 8-digit RUT

      // Short RUTs without separator should always fail (RUT number <= 7 digits)
      expect(isValidRut('19')).toBe(false) // RUT number: 1 (1 digit) - ambiguous
      expect(isValidRut('1-9')).toBe(true) // Has separator - unambiguous
    })
  })

  // Test formatRut function
  describe('formatRut', () => {
    test('should format valid RUTs correctly', () => {
      expect(formatRut('123456785')).toBe('12.345.678-5')
      expect(formatRut('7654316-K')).toBe('7.654.316-K')
      expect(formatRut('1-9')).toBe('1-9')
    })

    test('should return null for invalid RUTs', () => {
      invalidRuts.forEach((rut) => {
        expect(formatRut(rut)).toBe(null)
      })
    })

    test('should handle numeric input', () => {
      expect(formatRut(123456785)).toBe('12.345.678-5')
    })

    test('should handle non-string/non-number inputs', () => {
      expect(formatRut(null)).toBe(null)
      expect(formatRut(undefined)).toBe(null)
      expect(formatRut({})).toBe(null)
      expect(formatRut([])).toBe(null)
    })

    test('should respect requireVerificationDigit parameter', () => {
      // Edge case: short RUT without separator should fail with requireVerificationDigit: true
      expect(formatRut('19713741', true)).toBe(null)
      expect(formatRut('19', true)).toBe(null)

      // Valid RUTs should format correctly
      expect(formatRut('12.345.678-5', true)).toBe('12.345.678-5')
      expect(formatRut('12345678-5', true)).toBe('12.345.678-5')
      expect(formatRut('123456785', true)).toBe('12.345.678-5')
    })
  })

  // Test validateRut function
  describe('validateRut', () => {
    test('should return correct validation information for valid RUTs', () => {
      expect(validateRut('12.345.678-5')).toEqual({
        isValid: true,
        formatted: '12.345.678-5',
        raw: '123456785',
        rutNumber: '12345678',
        verificationDigit: '5'
      })

      expect(validateRut('7654316-K')).toEqual({
        isValid: true,
        formatted: '7.654.316-K',
        raw: '7654316K',
        rutNumber: '7654316',
        verificationDigit: 'K'
      })
    })

    test('should return invalid information for invalid RUTs', () => {
      const result = validateRut('12.345.678-9')
      expect(result.isValid).toBe(false)
      expect(result.formatted).toBe(null)
      expect(result.raw).toBe('123456789')
      expect(result.rutNumber).toBeUndefined()
      expect(result.verificationDigit).toBeUndefined()
    })

    test('should handle non-string inputs', () => {
      // Valid RUT as number
      expect(validateRut(123456785)).toEqual({
        isValid: true,
        formatted: '12.345.678-5',
        raw: '123456785',
        rutNumber: '12345678',
        verificationDigit: '5'
      })

      // Invalid inputs
      nonStringInputs.forEach((input) => {
        const result = validateRut(input)
        expect(result.isValid).toBe(false)
        expect(result.formatted).toBe(null)
      })
    })

    test('should respect requireVerificationDigit parameter', () => {
      // Edge case: short RUT without separator should fail with requireVerificationDigit: true
      const result1 = validateRut('19713741', true)
      expect(result1.isValid).toBe(false)
      expect(result1.formatted).toBe(null)
      expect(result1.raw).toBe('19713741')

      // Valid RUTs with separator should pass
      const result2 = validateRut('12.345.678-5', true)
      expect(result2.isValid).toBe(true)
      expect(result2.formatted).toBe('12.345.678-5')
      expect(result2.rutNumber).toBe('12345678')
      expect(result2.verificationDigit).toBe('5')

      // Short RUT without separator should fail
      const result3 = validateRut('19', true)
      expect(result3.isValid).toBe(false)
      expect(result3.formatted).toBe(null)

      // Formatted short RUT should pass
      const result4 = validateRut('1-9', true)
      expect(result4.isValid).toBe(true)
      expect(result4.formatted).toBe('1-9')
    })
  })
})
