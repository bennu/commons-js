# Password Validator

A simple, level-based password validation library for TypeScript/JavaScript projects.

## Features

- ✅ Three security levels: `low`, `medium`, `high`
- ✅ **Customizable minimum length per level**
- ✅ Returns missing requirements for user feedback
- ✅ Prevents repeated characters (3+ consecutive)
- ✅ Password confirmation matching
- ✅ Clean, simple API
- ✅ TypeScript support

## Installation

````

### Working with Typed Errors

```typescript
import {
  validatePassword,
  ValidationErrorType,
  hasErrorType,
  getErrorsByType,
  getCustomErrorMessages
} from '@bennu-cl/commons-js';

const result = validatePassword('abc', 'high');

// Check for specific error types (type-safe)
if (hasErrorType(result, ValidationErrorType.TOO_SHORT)) {
  console.log('Password is too short');
}

// Get errors of specific type
const lengthErrors = getErrorsByType(result, ValidationErrorType.TOO_SHORT);
lengthErrors.forEach(error => {
  console.log(`Expected: ${error.expectedValue}, Got: ${error.actualValue}`);
});

// Custom error messages (great for i18n)
const customMessages = {
  [ValidationErrorType.TOO_SHORT]: "La contraseña es muy corta",
  [ValidationErrorType.MISSING_UPPERCASE]: "Debe tener al menos una mayúscula"
};

const spanishErrors = getCustomErrorMessages(result, customMessages);
console.log(spanishErrors); // ["La contraseña es muy corta", "Debe tener al menos una mayúscula"]

// Process errors programmatically
result.errors.forEach(error => {
  switch (error.type) {
    case ValidationErrorType.TOO_SHORT:
      // Handle length error specifically
      break;
    case ValidationErrorType.MISSING_UPPERCASE:
      // Handle uppercase requirement
      break;
    // TypeScript ensures you handle all cases
  }
});
```bash
npm install @bennu-cl/commons-js
````

## Usage

### Basic Password Validation

```typescript
import {
  validatePassword,
  isValidPassword,
  ValidationErrorType,
} from "@bennu-cl/commons-js"

// Detailed validation with typed errors
const result = validatePassword("mypassword", "medium")
console.log(result)
// {
//   isValid: false,
//   errors: [
//     {
//       type: "MISSING_UPPERCASE",
//       message: "At least one uppercase letter",
//       expectedValue: undefined,
//       actualValue: undefined
//     }
//   ],
//   missing: ["At least one uppercase letter"], // deprecated but kept for compatibility
//   level: "medium"
// }

// Simple boolean check
const isValid = isValidPassword("MyPassword123", "medium")
console.log(isValid) // true

// Type-safe error checking
if (!result.isValid) {
  const hasLengthError = result.errors.some(
    (e) => e.type === ValidationErrorType.TOO_SHORT
  )
  const hasMissingUpper = result.errors.some(
    (e) => e.type === ValidationErrorType.MISSING_UPPERCASE
  )
}
```

### Password Matching

```typescript
import { validatePasswordMatch, passwordsMatch } from "@bennu-cl/commons-js"

// Detailed match validation
const matchResult = validatePasswordMatch("password123", "password123")
console.log(matchResult)
// { isMatch: true, error: null }

// Simple boolean check
const doMatch = passwordsMatch("password123", "different")
console.log(doMatch) // false
```

### Custom Minimum Lengths

You can customize the minimum character requirements for each security level:

```typescript
import { validatePassword, LengthConfig } from "@bennu-cl/commons-js"

// Custom configuration
const customLengths: LengthConfig = {
  low: 4, // Instead of default 6
  medium: 10, // Instead of default 8
  high: 16, // Instead of default 12
}

// Use custom lengths
const result = validatePassword("test", "low", customLengths)
console.log(result)
// { isValid: true, missing: [], level: "low" }

// Partial override (others use defaults)
const partialConfig: LengthConfig = {
  high: 20, // Only override high level
}

const result2 = validatePassword("MyP@ssw0rd123!", "high", partialConfig)
// Will require 20 characters for high level, but medium/low use defaults
```

## Security Levels

### Low Level

- **Minimum length:** 6 characters
- **Maximum length:** 64 characters
- **Requirements:** Only letters and numbers
- **Use case:** Basic forms, low-security applications

```typescript
validatePassword("abc123", "low") // ✅ Valid
```

### Medium Level (Default)

- **Minimum length:** 8 characters
- **Maximum length:** 64 characters
- **Requirements:** At least one uppercase letter, only alphanumeric
- **Use case:** Standard user accounts

```typescript
validatePassword("Password123", "medium") // ✅ Valid
```

### High Level

- **Minimum length:** 12 characters
- **Maximum length:** 64 characters
- **Requirements:** Uppercase, lowercase, number, and symbol
- **Use case:** Admin accounts, sensitive data

```typescript
validatePassword("MyP@ssw0rd123!", "high") // ✅ Valid
```

## API Reference

### `validatePassword(password, level?, customLengths?)`

Validates a password against the specified security level.

**Parameters:**

- `password` (unknown): The password to validate
- `level` (SecurityLevel): Security level ('low' | 'medium' | 'high') - defaults to 'medium'
- `customLengths` (LengthConfig): Optional custom minimum lengths per level

**Returns:** `ValidationResult`

- `isValid` (boolean): Whether the password meets all requirements
- `errors` (ValidationError[]): Array of typed validation errors
- `missing` (string[]): **@deprecated** Array of error messages (use `errors` instead)
- `level` (SecurityLevel): The security level used for validation

### `ValidationError`

Interface for typed validation errors.

**Properties:**

- `type` (ValidationErrorType): The specific error type (enum)
- `message` (string): Human-readable error message
- `expectedValue?` (number | string): Expected value (e.g., minimum length)
- `actualValue?` (number | string): Actual value (e.g., current length)

### `ValidationErrorType`

Enum with all possible validation error types:

- `EMPTY`: Password is empty
- `TOO_SHORT`: Password is shorter than required
- `TOO_LONG`: Password exceeds maximum length
- `MISSING_UPPERCASE`: Missing uppercase letter
- `MISSING_LOWERCASE`: Missing lowercase letter
- `MISSING_NUMBER`: Missing number
- `MISSING_SYMBOL`: Missing symbol
- `NOT_ALPHANUMERIC`: Contains non-alphanumeric characters (for low/medium levels)
- `REPEATED_CHARS`: Contains 3+ repeated consecutive characters

### `hasErrorType(result, errorType)`

Check if validation result contains a specific error type.

**Parameters:**

- `result` (ValidationResult): The validation result
- `errorType` (ValidationErrorType): The error type to check for

**Returns:** `boolean`

### `getErrorsByType(result, errorType)`

Get all errors of a specific type from validation result.

**Parameters:**

- `result` (ValidationResult): The validation result
- `errorType` (ValidationErrorType): The error type to filter by

**Returns:** `ValidationError[]`

### `getCustomErrorMessages(result, customMessages)`

Get error messages with custom translations/messages.

**Parameters:**

- `result` (ValidationResult): The validation result
- `customMessages` (Partial<Record<ValidationErrorType, string>>): Custom message mappings

**Returns:** `string[]`

### `isValidPassword(password, level?, customLengths?)`

Simple boolean check for password validity.

**Parameters:**

- `password` (unknown): The password to validate
- `level` (SecurityLevel): Security level - defaults to 'medium'
- `customLengths` (LengthConfig): Optional custom minimum lengths per level

**Returns:** `boolean`

### `LengthConfig`

Interface for customizing minimum lengths per security level.

**Properties:**

- `low?` (number): Custom minimum length for low security level (default: 6)
- `medium?` (number): Custom minimum length for medium security level (default: 8)
- `high?` (number): Custom minimum length for high security level (default: 12)

### `validatePasswordMatch(password1, password2)`

Validates if two passwords match.

**Parameters:**

- `password1` (unknown): First password
- `password2` (unknown): Second password (confirmation)

**Returns:** `PasswordMatchResult`

- `isMatch` (boolean): Whether passwords match
- `error` (string | null): Error message if passwords don't match

### `passwordsMatch(password1, password2)`

Simple boolean check for password matching.

**Parameters:**

- `password1` (unknown): First password
- `password2` (unknown): Second password

**Returns:** `boolean`

## Examples

### Form Validation (Modern Approach)

```typescript
import {
  validatePassword,
  validatePasswordMatch,
  ValidationErrorType,
  hasErrorType,
  LengthConfig,
} from "@bennu-cl/commons-js"

function validateForm(
  data: { password: string; confirmPassword: string },
  customLengths?: LengthConfig
) {
  // Validate password strength with typed errors
  const passwordValidation = validatePassword(
    data.password,
    "high",
    customLengths
  )

  if (!passwordValidation.isValid) {
    // Process errors by type for better UX
    const errorsByType = {
      length: hasErrorType(passwordValidation, ValidationErrorType.TOO_SHORT),
      uppercase: hasErrorType(
        passwordValidation,
        ValidationErrorType.MISSING_UPPERCASE
      ),
      symbols: hasErrorType(
        passwordValidation,
        ValidationErrorType.MISSING_SYMBOL
      ),
      // ... other checks
    }

    return {
      success: false,
      errors: passwordValidation.errors,
      errorsByType,
      // For backward compatibility (deprecated)
      message: `Password requirements not met: ${passwordValidation.missing.join(
        ", "
      )}`,
    }
  }

  // Validate password match
  const matchValidation = validatePasswordMatch(
    data.password,
    data.confirmPassword
  )

  if (!matchValidation.isMatch) {
    return {
      success: false,
      message: matchValidation.error,
    }
  }

  return { success: true }
}
```

### Real-time Feedback (Type-safe)

```typescript
function getPasswordFeedback(
  password: string,
  level: SecurityLevel = "medium",
  customLengths?: LengthConfig
) {
  const result = validatePassword(password, level, customLengths)

  if (result.isValid) {
    return { type: "success", message: "Password meets all requirements!" }
  }

  // Create specific feedback based on error types
  const feedback = result.errors.map((error) => {
    switch (error.type) {
      case ValidationErrorType.TOO_SHORT:
        return `Add ${
          error.expectedValue! - error.actualValue!
        } more characters`
      case ValidationErrorType.MISSING_UPPERCASE:
        return "Add at least one uppercase letter (A-Z)"
      case ValidationErrorType.MISSING_SYMBOL:
        return "Add at least one symbol (!@#$%^&*)"
      default:
        return error.message
    }
  })

  return {
    type: "error",
    messages: feedback,
    errorTypes: result.errors.map((e) => e.type),
  }
}
```

### Internationalization Example

```typescript
function createI18nValidator(locale: "en" | "es" | "fr") {
  const messages = {
    en: {
      [ValidationErrorType.TOO_SHORT]: "Password is too short",
      [ValidationErrorType.MISSING_UPPERCASE]: "Add uppercase letter",
      // ... other messages
    },
    es: {
      [ValidationErrorType.TOO_SHORT]: "La contraseña es muy corta",
      [ValidationErrorType.MISSING_UPPERCASE]: "Agregar letra mayúscula",
      // ... other messages
    },
    // ... other locales
  }

  return function validateWithI18n(password: string, level: SecurityLevel) {
    const result = validatePassword(password, level)

    if (!result.isValid) {
      const localizedMessages = getCustomErrorMessages(result, messages[locale])
      return { ...result, localizedMessages }
    }

    return result
  }
}
```

## Common Validation Messages

The library returns user-friendly messages for missing requirements:

- `"Password cannot be empty"`
- `"At least X characters"` (where X is configurable per level)
  - Default: 6 (low), 8 (medium), 12 (high)
  - Customizable via `LengthConfig`
- `"Maximum 64 characters"`
- `"At least one uppercase letter"`
- `"At least one lowercase letter"`
- `"At least one number"`
- `"At least one symbol"`
- `"Only letters and numbers allowed"`
- `"No repeated characters (3+ consecutive)"`
- `"Passwords do not match"`

## Migration Guide

### From v0.2.x to v0.3.x

The library now provides a much better error handling system while maintaining backward compatibility:

#### ✅ **Recommended (New Way)**:

```typescript
const result = validatePassword("weak", "high")

// Type-safe error checking
if (hasErrorType(result, ValidationErrorType.TOO_SHORT)) {
  console.log("Password is too short")
}

// Programmatic error handling
result.errors.forEach((error) => {
  switch (error.type) {
    case ValidationErrorType.TOO_SHORT:
      // Handle specifically
      break
  }
})
```

#### ⚠️ **Deprecated (Still Works)**:

```typescript
const result = validatePassword("weak", "high")

// Still works but deprecated
result.missing.forEach((message) => {
  console.log(message) // String matching required
})
```

#### **Benefits of New System**:

- ✅ **Type Safety**: Enums prevent typos and enable autocomplete
- ✅ **Internationalization**: Easy to translate error types to any language
- ✅ **Better UX**: Access to expected/actual values for detailed feedback
- ✅ **Maintainable**: No string matching needed in consuming code
- ✅ **Backward Compatible**: Existing code continues to work

## License

MIT © Bennu
