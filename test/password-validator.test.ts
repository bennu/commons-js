import {
  isStrongPassword,
  validatePasswordStrength,
  validatePasswordMatch,
  passwordsMatch,
  cleanPassword,
  calculatePasswordStrength,
  createStrongPasswordValidator,
  createPasswordMatchValidator,
  defaultPasswordConfig
} from '../src/password-validator'

describe('Password Validator', () => {
  // Test data: strong passwords (should pass default validation)
  const strongPasswords = [
    'MySecureP@ssw0rd123',
    'ComplexP@ss!2024',
    'Str0ng#Password$',
    'ValidP@ssw0rd2024!',
    'MyC0mplex#Password',
    'Secure123!@#Test',
    'P@ssw0rd!Strong123',
    'Complex!P@ss2024'
  ]

  // Test data: weak passwords (should fail default validation)
  const weakPasswords = [
    'password123', // No uppercase, no symbol
    'PASSWORD123', // No lowercase, no symbol
    'Password!', // Too short
    'Pass123!', // Too short
    'MyPassword', // No number, no symbol
    'mypassword123!', // No uppercase
    'MYPASSWORD123!', // No lowercase
    'MyPassword123', // No symbol
    '123456789!', // No letters
    'P@ss!', // Too short
    '', // Empty
    'a'.repeat(100), // Too long
    'Password123!Password123!Password123!Password123!Password123!Password123!' // Way too long
  ]

  const nonStringInputs: unknown[] = [
    null,
    undefined,
    {},
    [],
    123456789,
    true,
    false,
    Symbol('test'),
    new Date()
  ]

  // Test cleanPassword function
  describe('cleanPassword', () => {
    test('should remove leading and trailing whitespace', () => {
      expect(cleanPassword('  MyPassword123!  ')).toBe('MyPassword123!')
      expect(cleanPassword('\tMyPassword123!\t')).toBe('MyPassword123!')
      expect(cleanPassword('\nMyPassword123!\n')).toBe('MyPassword123!')
    })

    test('should preserve internal spaces', () => {
      expect(cleanPassword('My Password 123!')).toBe('My Password 123!')
    })

    test('should handle non-string inputs', () => {
      expect(cleanPassword(null)).toBe('')
      expect(cleanPassword(undefined)).toBe('')
      expect(cleanPassword(123456789)).toBe('123456789')
      expect(cleanPassword({})).toEqual(expect.any(String))
      expect(cleanPassword([])).toEqual(expect.any(String))
      expect(cleanPassword(true)).toBe('true')
    })

    test('should handle empty inputs', () => {
      expect(cleanPassword('')).toBe('')
      expect(cleanPassword('   ')).toBe('')
    })
  })

  // Test calculatePasswordStrength function
  describe('calculatePasswordStrength', () => {
    test('should return 0 for empty password', () => {
      expect(calculatePasswordStrength('')).toBe(0)
      expect(calculatePasswordStrength('   ')).toBe(0)
    })

    test('should return higher scores for stronger passwords', () => {
      const weakScore = calculatePasswordStrength('password')
      const strongScore = calculatePasswordStrength('MySecureP@ssw0rd123')
      expect(strongScore).toBeGreaterThan(weakScore)
    })

    test('should return score between 0 and 100', () => {
      strongPasswords.forEach(password => {
        const score = calculatePasswordStrength(password)
        expect(score).toBeGreaterThanOrEqual(0)
        expect(score).toBeLessThanOrEqual(100)
      })
    })
  })

  // Test isStrongPassword function
  describe('isStrongPassword', () => {
    test('should return true for strong passwords', () => {
      strongPasswords.forEach((password) => {
        expect(isStrongPassword(password)).toBe(true)
      })
    })

    test('should return false for weak passwords', () => {
      weakPasswords.forEach((password) => {
        expect(isStrongPassword(password)).toBe(false)
      })
    })

    test('should handle non-string inputs', () => {
      nonStringInputs.forEach((input) => {
        expect(isStrongPassword(input)).toBe(false)
      })
    })

    test('should respect custom configuration', () => {
      const customConfig = { 
        minLength: 6, 
        requireSymbol: false,
        requireUppercase: false 
      }
      expect(isStrongPassword('simple123', customConfig)).toBe(true)
      expect(isStrongPassword('simple123')).toBe(false) // Default config
    })
  })

  // Test validatePasswordStrength function
  describe('validatePasswordStrength', () => {
    test('should return correct validation information for strong passwords', () => {
      const result = validatePasswordStrength('MySecureP@ssw0rd123')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(result.strength).toBeGreaterThan(70)
      expect(result.raw).toBe('MySecureP@ssw0rd123')
      expect(result.checks.hasMinLength).toBe(true)
      expect(result.checks.hasMaxLength).toBe(true)
      expect(result.checks.hasUppercase).toBe(true)
      expect(result.checks.hasLowercase).toBe(true)
      expect(result.checks.hasNumber).toBe(true)
      expect(result.checks.hasSymbol).toBe(true)
    })

    test('should return detailed errors for weak passwords', () => {
      const result = validatePasswordStrength('weak')
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
      expect(result.errors).toContain('Password must be at least 12 characters long')
      expect(result.errors).toContain('Password must contain at least one number')
      expect(result.errors).toContain('Password must contain at least one symbol')
      expect(result.checks.hasMinLength).toBe(false)
      expect(result.checks.hasNumber).toBe(false)
      expect(result.checks.hasSymbol).toBe(false)
    })

    test('should handle custom configuration', () => {
      const customConfig = { minLength: 6, requireSymbol: false }
      const result = validatePasswordStrength('MyPass123', customConfig)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    test('should handle non-string inputs', () => {
      nonStringInputs.forEach((input) => {
        const result = validatePasswordStrength(input)
        expect(result.isValid).toBe(false)
        expect(result.errors.length).toBeGreaterThan(0)
        expect(result.raw).toBe(String(input || ''))
      })
    })
  })

  // Test validatePasswordMatch function
  describe('validatePasswordMatch', () => {
    test('should return true for matching passwords', () => {
      const result = validatePasswordMatch('MyPassword123!', 'MyPassword123!')
      expect(result.isMatch).toBe(true)
      expect(result.error).toBe(null)
      expect(result.password1).toBe('MyPassword123!')
      expect(result.password2).toBe('MyPassword123!')
    })

    test('should return false for non-matching passwords', () => {
      const result = validatePasswordMatch('MyPassword123!', 'MyPassword123@')
      expect(result.isMatch).toBe(false)
      expect(result.error).toBe('Passwords do not match')
      expect(result.password1).toBe('MyPassword123!')
      expect(result.password2).toBe('MyPassword123@')
    })

    test('should handle whitespace correctly', () => {
      const result = validatePasswordMatch('  MyPassword123!  ', 'MyPassword123!')
      expect(result.isMatch).toBe(true)
      expect(result.error).toBe(null)
    })

    test('should handle non-string inputs', () => {
      const result1 = validatePasswordMatch(null, undefined)
      expect(result1.isMatch).toBe(true) // Both clean to empty string
      expect(result1.password1).toBe('')
      expect(result1.password2).toBe('')

      const result2 = validatePasswordMatch('password', 123)
      expect(result2.isMatch).toBe(false)
      expect(result2.password1).toBe('password')
      expect(result2.password2).toBe('123')
    })
  })

  // Test passwordsMatch function
  describe('passwordsMatch', () => {
    test('should return true for matching passwords', () => {
      expect(passwordsMatch('MyPassword123!', 'MyPassword123!')).toBe(true)
      expect(passwordsMatch('', '')).toBe(true)
      expect(passwordsMatch(null, undefined)).toBe(true)
    })

    test('should return false for non-matching passwords', () => {
      expect(passwordsMatch('MyPassword123!', 'MyPassword123@')).toBe(false)
      expect(passwordsMatch('password', 'different')).toBe(false)
      expect(passwordsMatch('password', null)).toBe(false)
    })

    test('should handle non-string inputs', () => {
      expect(passwordsMatch(123, 123)).toBe(true)
      expect(passwordsMatch(123, 456)).toBe(false)
    })
  })

  // Test Angular validator functions
  describe('createStrongPasswordValidator', () => {
    test('should return null for valid passwords', () => {
      const validator = createStrongPasswordValidator()
      const mockControl = { value: 'MySecureP@ssw0rd123' }
      
      expect(validator(mockControl)).toBe(null)
    })

    test('should return error object for invalid passwords', () => {
      const validator = createStrongPasswordValidator()
      const mockControl = { value: 'weak' }
      
      const result = validator(mockControl)
      expect(result).not.toBe(null)
      if (result) {
        expect(result).toHaveProperty('weakPassword')
        expect(result.weakPassword).toHaveProperty('errors')
        expect(result.weakPassword).toHaveProperty('strength')
        expect(Array.isArray(result.weakPassword.errors)).toBe(true)
        expect(typeof result.weakPassword.strength).toBe('number')
      }
    })

    test('should respect custom configuration', () => {
      const validator = createStrongPasswordValidator({ minLength: 6, requireSymbol: false })
      const mockControl = { value: 'MyPass123' }
      
      expect(validator(mockControl)).toBe(null)
    })
  })

  describe('createPasswordMatchValidator', () => {
    test('should return null for matching passwords', () => {
      const validator = createPasswordMatchValidator('pass1', 'pass2')
      const mockFormGroup = {
        get: (fieldName: string) => {
          if (fieldName === 'pass1') return { value: 'MyPassword123!' }
          if (fieldName === 'pass2') return { value: 'MyPassword123!' }
          return null
        }
      }
      
      expect(validator(mockFormGroup)).toBe(null)
    })

    test('should return error object for non-matching passwords', () => {
      const validator = createPasswordMatchValidator('pass1', 'pass2')
      const mockFormGroup = {
        get: (fieldName: string) => {
          if (fieldName === 'pass1') return { value: 'MyPassword123!' }
          if (fieldName === 'pass2') return { value: 'MyPassword123@' }
          return null
        }
      }
      
      const result = validator(mockFormGroup)
      expect(result).not.toBe(null)
      if (result) {
        expect(result).toHaveProperty('passwordsMismatch')
        expect(result.passwordsMismatch).toBe(true)
      }
    })

    test('should use default field names', () => {
      const validator = createPasswordMatchValidator()
      const mockFormGroup = {
        get: (fieldName: string) => {
          if (fieldName === 'password') return { value: 'MyPassword123!' }
          if (fieldName === 'confirmPassword') return { value: 'MyPassword123!' }
          return null
        }
      }
      
      expect(validator(mockFormGroup)).toBe(null)
    })
  })

  // Test default configuration
  describe('defaultPasswordConfig', () => {
    test('should have expected default values', () => {
      expect(defaultPasswordConfig.minLength).toBe(12)
      expect(defaultPasswordConfig.maxLength).toBe(64)
      expect(defaultPasswordConfig.requireUppercase).toBe(true)
      expect(defaultPasswordConfig.requireLowercase).toBe(true)
      expect(defaultPasswordConfig.requireNumber).toBe(true)
      expect(defaultPasswordConfig.requireSymbol).toBe(true)
      expect(defaultPasswordConfig.symbolPattern).toBeInstanceOf(RegExp)
    })
  })
})