import {
  validatePassword,
  isValidPassword,
  validatePasswordMatch,
  passwordsMatch,
  SecurityLevel,
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
          expect(result.missing).toHaveLength(0)
          expect(result.level).toBe(LOW_LEVEL)
        })
      })

      test("should reject invalid low-level passwords", () => {
        passwordTestData.low.invalid.forEach((password) => {
          const result = validatePassword(password, LOW_LEVEL)
          expect(result.isValid).toBe(false)
          expect(result.missing.length).toBeGreaterThan(0)
          expect(result.level).toBe(LOW_LEVEL)
        })
      })

      test("should reject too short passwords", () => {
        const result = validatePassword("abc12", LOW_LEVEL)
        expect(result.isValid).toBe(false)
        expect(result.missing).toContain("At least 6 characters")
      })

      test("should reject non-alphanumeric passwords", () => {
        const result = validatePassword("abc123!", LOW_LEVEL)
        expect(result.isValid).toBe(false)
        expect(result.missing).toContain("Only letters and numbers allowed")
      })
    })

    describe("Medium security level", () => {
      test("should validate correct medium-level passwords", () => {
        passwordTestData.medium.valid.forEach((password) => {
          const result = validatePassword(password, MEDIUM_LEVEL)
          expect(result.isValid).toBe(true)
          expect(result.missing).toHaveLength(0)
          expect(result.level).toBe(MEDIUM_LEVEL)
        })
      })

      test("should reject invalid medium-level passwords", () => {
        passwordTestData.medium.invalid.forEach((password) => {
          const result = validatePassword(password, MEDIUM_LEVEL)
          expect(result.isValid).toBe(false)
          expect(result.missing.length).toBeGreaterThan(0)
          expect(result.level).toBe(MEDIUM_LEVEL)
        })
      })

      test("should require uppercase letter", () => {
        const result = validatePassword("password123", MEDIUM_LEVEL)
        expect(result.isValid).toBe(false)
        expect(result.missing).toContain("At least one uppercase letter")
      })

      test("should require minimum 8 characters", () => {
        const result = validatePassword("Pass12", MEDIUM_LEVEL)
        expect(result.isValid).toBe(false)
        expect(result.missing).toContain("At least 8 characters")
      })

      test("should reject symbols", () => {
        const result = validatePassword("Password123!", MEDIUM_LEVEL)
        expect(result.isValid).toBe(false)
        expect(result.missing).toContain("Only letters and numbers allowed")
      })
    })

    describe("High security level", () => {
      test("should validate correct high-level passwords", () => {
        passwordTestData.high.valid.forEach((password) => {
          const result = validatePassword(password, HIGH_LEVEL)
          expect(result.isValid).toBe(true)
          expect(result.missing).toHaveLength(0)
          expect(result.level).toBe(HIGH_LEVEL)
        })
      })

      test("should reject invalid high-level passwords", () => {
        passwordTestData.high.invalid.forEach((password) => {
          const result = validatePassword(password, HIGH_LEVEL)
          expect(result.isValid).toBe(false)
          expect(result.missing.length).toBeGreaterThan(0)
          expect(result.level).toBe(HIGH_LEVEL)
        })
      })

      test("should require all character types", () => {
        const testCases = [
          {
            password: "mypassword123!",
            missing: "At least one uppercase letter",
          },
          {
            password: "MYPASSWORD123!",
            missing: "At least one lowercase letter",
          },
          { password: "MyPassword!", missing: "At least one number" },
          { password: "MyPassword123", missing: "At least one symbol" },
        ]

        testCases.forEach(({ password, missing }) => {
          const result = validatePassword(password, HIGH_LEVEL)
          expect(result.isValid).toBe(false)
          expect(result.missing).toContain(missing)
        })
      })

      test("should require minimum 12 characters", () => {
        const result = validatePassword("MyPass1!", HIGH_LEVEL)
        expect(result.isValid).toBe(false)
        expect(result.missing).toContain("At least 12 characters")
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
          expect(result.missing).toContain(
            "No repeated characters (3+ consecutive)"
          )
        })
      })

      test("should allow passwords with 2 repeated characters", () => {
        const result = validatePassword("MyPasswword123!", HIGH_LEVEL)
        expect(result.missing).not.toContain(
          "No repeated characters (3+ consecutive)"
        )
      })
    })

    describe("Length validation", () => {
      test("should reject too long passwords", () => {
        const tooLongPassword = "a".repeat(65) + "A1!"
        const result = validatePassword(tooLongPassword, HIGH_LEVEL)
        expect(result.isValid).toBe(false)
        expect(result.missing).toContain("Maximum 64 characters")
      })
    })

    describe("Empty and invalid inputs", () => {
      test("should handle empty passwords", () => {
        const result = validatePassword("", MEDIUM_LEVEL)
        expect(result.isValid).toBe(false)
        expect(result.missing).toContain("Password cannot be empty")
        expect(result.level).toBe(MEDIUM_LEVEL)
      })

      test("should handle whitespace-only passwords", () => {
        const result = validatePassword("   ", MEDIUM_LEVEL)
        expect(result.isValid).toBe(false)
        expect(result.missing).toContain("Password cannot be empty")
      })

      test("should handle non-string inputs", () => {
        nonStringInputs.forEach((input) => {
          const result = validatePassword(input, MEDIUM_LEVEL)
          expect(result.isValid).toBe(false)
          expect(result.missing).toContain("Password cannot be empty")
          expect(result.level).toBe(MEDIUM_LEVEL)
        })
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
      expect(result.missing).toEqual(
        expect.arrayContaining([
          "At least 12 characters",
          "At least one uppercase letter",
          "At least one number",
          "At least one symbol",
        ])
      )
    })

    test("should return all missing requirements for empty password", () => {
      const result = validatePassword("", HIGH_LEVEL)
      expect(result.isValid).toBe(false)
      expect(result.missing).toEqual(["Password cannot be empty"])
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
      expect(result.missing).not.toContain("Maximum 64 characters")
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
