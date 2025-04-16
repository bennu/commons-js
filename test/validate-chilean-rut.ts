import {
  isValidRut,
  validateRut,
  formatRut,
  cleanRut,
  calculateVerificationDigit
} from '../src/validate-chilean-rut'

describe('Chilean RUT Validator', () => {
  // Test data: valid RUTs
  const validRuts = [
    '12.345.678-5',
    '12345678-5',
    '123456785',
    '7.654.321-K',
    '7654321-K',
    '7654321K',
    '1-9',
    '19',
    '20.948.252-5'
  ]

  // Test data: invalid RUTs
  const invalidRuts = [
    '12.345.678-9', // Wrong verification digit
    '7.654.321-1', // Wrong verification digit
    'A12345678', // Contains letters in the number part
    '12345678A', // Contains letter in place of verification digit (not K)
    '', // Empty string
    '1', // Too short
    '1234567890K', // Too long
    '123456789', // Wrong length
    '12.345.678', // Missing verification digit
    '12.345.678-', // Missing verification digit
    '-5', // Missing RUT number
    '12345678-9K', // Multiple verification digits
    '12345678--5', // Multiple separators
    '12.345.678..5' // Incorrect format
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

  // Test cleanRut function
  describe('cleanRut', () => {
    test('should remove formatting characters', () => {
      expect(cleanRut('12.345.678-5')).toBe('123456785')
      expect(cleanRut('7.654.321-K')).toBe('7654321K')
      expect(cleanRut('1-9')).toBe('19')
    })

    test('should convert to uppercase', () => {
      expect(cleanRut('7.654.321-k')).toBe('7654321K')
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
      expect(calculateVerificationDigit('7654321')).toBe('K')
      expect(calculateVerificationDigit('1')).toBe('9')
      expect(calculateVerificationDigit('20948252')).toBe('5')
    })

    test('should handle numeric input', () => {
      expect(calculateVerificationDigit(12345678)).toBe('5')
      expect(calculateVerificationDigit(7654321)).toBe('K')
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
        expect(isValidRut(rut)).toBe(true)
      })
    })

    test('should return false for invalid RUTs', () => {
      invalidRuts.forEach((rut) => {
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
  })

  // Test formatRut function
  describe('formatRut', () => {
    test('should format valid RUTs correctly', () => {
      expect(formatRut('123456785')).toBe('12.345.678-5')
      expect(formatRut('7654321K')).toBe('7.654.321-K')
      expect(formatRut('19')).toBe('1-9')
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

      expect(validateRut('7654321K')).toEqual({
        isValid: true,
        formatted: '7.654.321-K',
        raw: '7654321K',
        rutNumber: '7654321',
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
  })
})
