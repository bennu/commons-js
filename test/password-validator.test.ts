import {
  validatePassword,
  isValidPassword,
  validatePasswordMatch,
  passwordsMatch,
  SecurityLevel,
  ValidationErrorType,
  hasErrorType,
  getErrorsByType,
  getCustomErrorMessages,
} from "../src/password-validator/password-validator"

describe("Simplified Password Validator", () => {
  // Security level constants
  const LOW_LEVEL: SecurityLevel = "low"
  const MEDIUM_LEVEL: SecurityLevel = "medium"
  const HIGH_LEVEL: SecurityLevel = "high"

  // Test data for different security levels
  const passwordTestData = {
    low: {
      valid: ["abc123", "password", "simple123", "test123456"],
      invalid: ["abc12", "ab123", "abc@123", "test!123"], // too short or has symbols
    },
    medium: {
      valid: ["Password123", "MyPass123", "TestAbc123", "SimplePass1"],
      invalid: ["password123", "abc12345", "Pass123!", "MyP@ss123"], // no uppercase or has symbols
    },
    high: {
      valid: [
        "MySecureP@ssw0rd123",
        "ComplexP@ss!2024",
        "Str0ng#Password$",
        "ValidP@ssw0rd2024!",
      ],
      invalid: ["MyPassword123", "password123!", "PASSWORD123!", "MyPass123"], // missing requirements
    },
  }

  const nonStringInputs: unknown[] = [
    null,
    undefined,
    {},
    [],
    123456789,
    true,
    false,
    Symbol("test"),
    new Date(),
  ]

  // Test validatePassword function
  describe("validatePassword", () => {
    describe("Low security level", () => {
      test("should validate correct low-level passwords", () => {
        passwordTestData.low.valid.forEach((password) => {
          const result = validatePassword(password, LOW_LEVEL)
          expect(result.isValid).toBe(true)
          expect(result.errors).toHaveLength(0)
          expect(result.level).toBe(LOW_LEVEL)
        })
      })

      test("should reject invalid low-level passwords", () => {
        passwordTestData.low.invalid.forEach((password) => {
          const result = validatePassword(password, LOW_LEVEL)
          expect(result.isValid).toBe(false)
          expect(result.errors.length).toBeGreaterThan(0)
          expect(result.level).toBe(LOW_LEVEL)
        })
      })

      test("should reject too short passwords with correct error type", () => {
        const result = validatePassword("abc12", LOW_LEVEL)
        expect(result.isValid).toBe(false)
        expect(hasErrorType(result, ValidationErrorType.TOO_SHORT)).toBe(true)

        const shortErrors = getErrorsByType(
          result,
          ValidationErrorType.TOO_SHORT
        )
        expect(shortErrors).toHaveLength(1)
        expect(shortErrors[0].expectedValue).toBe(6)
        expect(shortErrors[0].actualValue).toBe(5)
      })

      test("should reject non-alphanumeric passwords", () => {
        const result = validatePassword("abc123!", LOW_LEVEL)
        expect(result.isValid).toBe(false)
        expect(hasErrorType(result, ValidationErrorType.NOT_ALPHANUMERIC)).toBe(
          true
        )
      })
    })

    describe("Medium security level", () => {
      test("should validate correct medium-level passwords", () => {
        passwordTestData.medium.valid.forEach((password) => {
          const result = validatePassword(password, MEDIUM_LEVEL)
          expect(result.isValid).toBe(true)
          expect(result.errors).toHaveLength(0)
          expect(result.level).toBe(MEDIUM_LEVEL)
        })
      })

      test("should reject invalid medium-level passwords", () => {
        passwordTestData.medium.invalid.forEach((password) => {
          const result = validatePassword(password, MEDIUM_LEVEL)
          expect(result.isValid).toBe(false)
          expect(result.errors.length).toBeGreaterThan(0)
          expect(result.level).toBe(MEDIUM_LEVEL)
        })
      })

      test("should require uppercase letter", () => {
        const result = validatePassword("password123", MEDIUM_LEVEL)
        expect(result.isValid).toBe(false)
        expect(
          hasErrorType(result, ValidationErrorType.MISSING_UPPERCASE)
        ).toBe(true)
      })

      test("should require minimum 8 characters", () => {
        const result = validatePassword("Pass12", MEDIUM_LEVEL)
        expect(result.isValid).toBe(false)
        expect(hasErrorType(result, ValidationErrorType.TOO_SHORT)).toBe(true)
      })

      test("should reject symbols", () => {
        const result = validatePassword("Password123!", MEDIUM_LEVEL)
        expect(result.isValid).toBe(false)
        expect(hasErrorType(result, ValidationErrorType.NOT_ALPHANUMERIC)).toBe(
          true
        )
      })
    })

    describe("High security level", () => {
      test("should validate correct high-level passwords", () => {
        passwordTestData.high.valid.forEach((password) => {
          const result = validatePassword(password, HIGH_LEVEL)
          expect(result.isValid).toBe(true)
          expect(result.errors).toHaveLength(0)
          expect(result.level).toBe(HIGH_LEVEL)
        })
      })

      test("should reject invalid high-level passwords", () => {
        passwordTestData.high.invalid.forEach((password) => {
          const result = validatePassword(password, HIGH_LEVEL)
          expect(result.isValid).toBe(false)
          expect(result.errors.length).toBeGreaterThan(0)
          expect(result.level).toBe(HIGH_LEVEL)
        })
      })

      test("should require all character types", () => {
        const testCases = [
          {
            password: "mypassword123!",
            errorType: ValidationErrorType.MISSING_UPPERCASE,
          },
          {
            password: "MYPASSWORD123!",
            errorType: ValidationErrorType.MISSING_LOWERCASE,
          },
          {
            password: "MyPassword!",
            errorType: ValidationErrorType.MISSING_NUMBER,
          },
          {
            password: "MyPassword123",
            errorType: ValidationErrorType.MISSING_SYMBOL,
          },
        ]

        testCases.forEach(({ password, errorType }) => {
          const result = validatePassword(password, HIGH_LEVEL)
          expect(result.isValid).toBe(false)
          expect(hasErrorType(result, errorType)).toBe(true)
        })
      })

      test("should require minimum 12 characters", () => {
        const result = validatePassword("MyPass1!", HIGH_LEVEL)
        expect(result.isValid).toBe(false)
        expect(hasErrorType(result, ValidationErrorType.TOO_SHORT)).toBe(true)
      })
    })

    describe("Repeated characters validation", () => {
      test("should reject passwords with 3+ repeated characters", () => {
        const passwordsWithRepeats = [
          "MyPasssssword123!",
          "MyPassword1111!",
          "MMMPassword123!",
          "MyPassword!!!123",
        ]

        passwordsWithRepeats.forEach((password) => {
          const result = validatePassword(password, HIGH_LEVEL)
          expect(result.isValid).toBe(false)
          expect(hasErrorType(result, ValidationErrorType.REPEATED_CHARS)).toBe(
            true
          )
        })
      })

      test("should allow passwords with 2 repeated characters", () => {
        const result = validatePassword("MyPasswword123!", HIGH_LEVEL)
        expect(hasErrorType(result, ValidationErrorType.REPEATED_CHARS)).toBe(
          false
        )
      })
    })

    describe("Length validation", () => {
      test("should reject too long passwords", () => {
        const tooLongPassword = "a".repeat(65) + "A1!"
        const result = validatePassword(tooLongPassword, HIGH_LEVEL)
        expect(result.isValid).toBe(false)
        expect(hasErrorType(result, ValidationErrorType.TOO_LONG)).toBe(true)
      })
    })

    describe("Empty and invalid inputs", () => {
      test("should handle empty passwords", () => {
        const result = validatePassword("", MEDIUM_LEVEL)
        expect(result.isValid).toBe(false)
        expect(hasErrorType(result, ValidationErrorType.EMPTY)).toBe(true)
        expect(result.level).toBe(MEDIUM_LEVEL)
      })

      test("should handle whitespace-only passwords", () => {
        const result = validatePassword("   ", MEDIUM_LEVEL)
        expect(result.isValid).toBe(false)
        expect(hasErrorType(result, ValidationErrorType.EMPTY)).toBe(true)
      })

      test("should handle non-string inputs", () => {
        nonStringInputs.forEach((input) => {
          const result = validatePassword(input, MEDIUM_LEVEL)
          expect(result.isValid).toBe(false)
          expect(hasErrorType(result, ValidationErrorType.EMPTY)).toBe(true)
          expect(result.level).toBe(MEDIUM_LEVEL)
        })
      })
    })

    describe("Custom lengths", () => {
      test("should use custom minimum lengths", () => {
        const customLengths = { low: 4, medium: 10, high: 16 }

        // Test low level with custom length
        const lowResult = validatePassword("abc1", LOW_LEVEL, customLengths)
        expect(lowResult.isValid).toBe(true)

        // Test medium level with custom length
        const mediumResult = validatePassword(
          "Password12",
          MEDIUM_LEVEL,
          customLengths
        )
        expect(mediumResult.isValid).toBe(false)
        expect(hasErrorType(mediumResult, ValidationErrorType.TOO_SHORT)).toBe(
          true
        )

        // Test high level with custom length
        const highResult = validatePassword(
          "MyP@ssw0rd123!",
          HIGH_LEVEL,
          customLengths
        )
        expect(highResult.isValid).toBe(false)
        expect(hasErrorType(highResult, ValidationErrorType.TOO_SHORT)).toBe(
          true
        )
      })

      test("should use partial custom config", () => {
        const partialConfig = { high: 20 }

        const result = validatePassword(
          "MyP@ssw0rd123!Extra",
          HIGH_LEVEL,
          partialConfig
        )
        expect(result.isValid).toBe(false)
        expect(hasErrorType(result, ValidationErrorType.TOO_SHORT)).toBe(true)

        const shortErrors = getErrorsByType(
          result,
          ValidationErrorType.TOO_SHORT
        )
        expect(shortErrors[0].expectedValue).toBe(20)
      })
    })

    describe("Default level", () => {
      test("should use medium level as default", () => {
        const result = validatePassword("Password123")
        expect(result.level).toBe(MEDIUM_LEVEL)
      })
    })
  })

  // Test isValidPassword function
  describe("isValidPassword", () => {
    test("should return true for valid passwords", () => {
      expect(isValidPassword("Password123", MEDIUM_LEVEL)).toBe(true)
      expect(isValidPassword("abc123", LOW_LEVEL)).toBe(true)
      expect(isValidPassword("MySecureP@ssw0rd123", HIGH_LEVEL)).toBe(true)
    })

    test("should return false for invalid passwords", () => {
      expect(isValidPassword("password123", MEDIUM_LEVEL)).toBe(false)
      expect(isValidPassword("abc12", LOW_LEVEL)).toBe(false)
      expect(isValidPassword("MyPassword123", HIGH_LEVEL)).toBe(false)
    })

    test("should handle non-string inputs", () => {
      nonStringInputs.forEach((input) => {
        expect(isValidPassword(input, MEDIUM_LEVEL)).toBe(false)
      })
    })

    test("should use medium level as default", () => {
      expect(isValidPassword("Password123")).toBe(true)
      expect(isValidPassword("password123")).toBe(false)
    })

    test("should work with custom lengths", () => {
      const customLengths = { low: 4 }
      expect(isValidPassword("abc1", LOW_LEVEL, customLengths)).toBe(true)
      expect(isValidPassword("abc1", LOW_LEVEL)).toBe(false) // Without custom config
    })
  })

  // Test error utility functions
  describe("Error utility functions", () => {
    test("hasErrorType should correctly identify error types", () => {
      const result = validatePassword("abc", HIGH_LEVEL)

      expect(hasErrorType(result, ValidationErrorType.TOO_SHORT)).toBe(true)
      expect(hasErrorType(result, ValidationErrorType.MISSING_UPPERCASE)).toBe(
        true
      )
      expect(hasErrorType(result, ValidationErrorType.MISSING_NUMBER)).toBe(
        true
      )
      expect(hasErrorType(result, ValidationErrorType.MISSING_SYMBOL)).toBe(
        true
      )
      expect(hasErrorType(result, ValidationErrorType.EMPTY)).toBe(false)
    })

    test("getErrorsByType should filter errors correctly", () => {
      const result = validatePassword("abc", HIGH_LEVEL)

      const shortErrors = getErrorsByType(result, ValidationErrorType.TOO_SHORT)
      expect(shortErrors).toHaveLength(1)
      expect(shortErrors[0].type).toBe(ValidationErrorType.TOO_SHORT)
      expect(shortErrors[0].expectedValue).toBe(12)
      expect(shortErrors[0].actualValue).toBe(3)

      const upperErrors = getErrorsByType(
        result,
        ValidationErrorType.MISSING_UPPERCASE
      )
      expect(upperErrors).toHaveLength(1)
      expect(upperErrors[0].type).toBe(ValidationErrorType.MISSING_UPPERCASE)
    })

    test("getCustomErrorMessages should return custom messages", () => {
      const result = validatePassword("abc", HIGH_LEVEL)

      const customMessages = {
        [ValidationErrorType.TOO_SHORT]: "La contraseña es muy corta",
        [ValidationErrorType.MISSING_UPPERCASE]: "Falta letra mayúscula",
      }

      const messages = getCustomErrorMessages(result, customMessages)

      expect(messages).toContain("La contraseña es muy corta")
      expect(messages).toContain("Falta letra mayúscula")
      // Should use default message for types not in customMessages
      expect(messages.some((msg) => msg.includes("number"))).toBe(true)
    })
  })

  // Test validatePasswordMatch function
  describe("validatePasswordMatch", () => {
    test("should return true for matching passwords", () => {
      const result = validatePasswordMatch("MyPassword123!", "MyPassword123!")
      expect(result.isMatch).toBe(true)
      expect(result.error).toBe(null)
    })

    test("should return false for non-matching passwords", () => {
      const result = validatePasswordMatch("MyPassword123!", "MyPassword123@")
      expect(result.isMatch).toBe(false)
      expect(result.error).toBe("Passwords do not match")
    })

    test("should handle whitespace correctly", () => {
      const result = validatePasswordMatch(
        "  MyPassword123!  ",
        "MyPassword123!"
      )
      expect(result.isMatch).toBe(true)
      expect(result.error).toBe(null)
    })

    test("should handle empty passwords", () => {
      const result1 = validatePasswordMatch("", "")
      expect(result1.isMatch).toBe(false)
      expect(result1.error).toBe("Passwords do not match")

      const result2 = validatePasswordMatch(null, undefined)
      expect(result2.isMatch).toBe(false)
      expect(result2.error).toBe("Passwords do not match")
    })

    test("should handle non-string inputs", () => {
      const result1 = validatePasswordMatch("password", 123)
      expect(result1.isMatch).toBe(false)
      expect(result1.error).toBe("Passwords do not match")

      const result2 = validatePasswordMatch(123, 123)
      expect(result2.isMatch).toBe(true)
      expect(result2.error).toBe(null)
    })
  })

  // Test passwordsMatch function
  describe("passwordsMatch", () => {
    test("should return true for matching passwords", () => {
      expect(passwordsMatch("MyPassword123!", "MyPassword123!")).toBe(true)
      expect(passwordsMatch(123, 123)).toBe(true)
    })

    test("should return false for non-matching passwords", () => {
      expect(passwordsMatch("MyPassword123!", "MyPassword123@")).toBe(false)
      expect(passwordsMatch("password", "different")).toBe(false)
      expect(passwordsMatch("password", null)).toBe(false)
      expect(passwordsMatch("", "")).toBe(false) // Empty passwords don't match
    })

    test("should handle non-string inputs", () => {
      expect(passwordsMatch(123, 456)).toBe(false)
      expect(passwordsMatch(null, undefined)).toBe(false)
    })
  })

  // Test specific error message combinations
  describe("Multiple validation errors", () => {
    test("should return multiple missing requirements", () => {
      const result = validatePassword("abc", HIGH_LEVEL)
      expect(result.isValid).toBe(false)

      // Check that all expected error types are present
      expect(hasErrorType(result, ValidationErrorType.TOO_SHORT)).toBe(true)
      expect(hasErrorType(result, ValidationErrorType.MISSING_UPPERCASE)).toBe(
        true
      )
      expect(hasErrorType(result, ValidationErrorType.MISSING_NUMBER)).toBe(
        true
      )
      expect(hasErrorType(result, ValidationErrorType.MISSING_SYMBOL)).toBe(
        true
      )
    })

    test("should return empty error for empty password", () => {
      const result = validatePassword("", HIGH_LEVEL)
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].type).toBe(ValidationErrorType.EMPTY)
    })
  })

  // Test edge cases
  describe("Edge cases", () => {
    test("should handle exactly minimum length passwords", () => {
      expect(validatePassword("abc123", LOW_LEVEL).isValid).toBe(true) // exactly 6 chars
      expect(validatePassword("Password", MEDIUM_LEVEL).isValid).toBe(true) // exactly 8 chars
      expect(validatePassword("MyP@ssw0rd12", HIGH_LEVEL).isValid).toBe(true) // exactly 12 chars
    })

    test("should handle exactly maximum length passwords", () => {
      const maxLengthPassword = "A".repeat(32) + "1".repeat(31) + "!"
      expect(maxLengthPassword.length).toBe(64)
      const result = validatePassword(maxLengthPassword, HIGH_LEVEL)
      expect(hasErrorType(result, ValidationErrorType.TOO_LONG)).toBe(false)
    })

    test("should handle unicode characters", () => {
      const result = validatePassword("MyPássw0rd123!", HIGH_LEVEL)
      expect(result.isValid).toBe(true)
    })

    test("should test all security levels with type safety", () => {
      const levels: SecurityLevel[] = [LOW_LEVEL, MEDIUM_LEVEL, HIGH_LEVEL]

      levels.forEach((level) => {
        const result = validatePassword("test", level)
        expect(result.level).toBe(level)
        expect(["low", "medium", "high"]).toContain(result.level)
      })
    })
  })
})
