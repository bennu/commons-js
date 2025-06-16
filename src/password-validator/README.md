# Password Validator

A simple, level-based password validation library for TypeScript/JavaScript projects.

## Features

- ✅ Three security levels: `low`, `medium`, `high`
- ✅ Returns missing requirements for user feedback
- ✅ Prevents repeated characters (3+ consecutive)
- ✅ Password confirmation matching
- ✅ Clean, simple API
- ✅ TypeScript support

## Installation

```bash
npm install @bennu-cl/commons-js
```

## Usage

### Basic Password Validation

```typescript
import { validatePassword, isValidPassword } from "@bennu-cl/commons-js"

// Detailed validation with missing requirements
const result = validatePassword("mypassword", "medium")
console.log(result)
// {
//   isValid: false,
//   missing: ["At least one uppercase letter"],
//   level: "medium"
// }

// Simple boolean check
const isValid = isValidPassword("MyPassword123", "medium")
console.log(isValid) // true
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

### `validatePassword(password, level?)`

Validates a password against the specified security level.

**Parameters:**

- `password` (unknown): The password to validate
- `level` (SecurityLevel): Security level ('low' | 'medium' | 'high') - defaults to 'medium'

**Returns:** `ValidationResult`

- `isValid` (boolean): Whether the password meets all requirements
- `missing` (string[]): Array of missing requirements
- `level` (SecurityLevel): The security level used for validation

### `isValidPassword(password, level?)`

Simple boolean check for password validity.

**Parameters:**

- `password` (unknown): The password to validate
- `level` (SecurityLevel): Security level - defaults to 'medium'

**Returns:** `boolean`

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

### Form Validation

```typescript
function validateForm(data: { password: string; confirmPassword: string }) {
  // Validate password strength
  const passwordValidation = validatePassword(data.password, "high")

  if (!passwordValidation.isValid) {
    return {
      success: false,
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

### Real-time Feedback

```typescript
function getPasswordFeedback(
  password: string,
  level: SecurityLevel = "medium"
) {
  const result = validatePassword(password, level)

  if (result.isValid) {
    return { type: "success", message: "Password meets all requirements!" }
  }

  return {
    type: "error",
    message: `Missing: ${result.missing.join(", ")}`,
  }
}
```

## Common Validation Messages

The library returns user-friendly messages for missing requirements:

- `"Password cannot be empty"`
- `"At least 6 characters"` (for low level)
- `"At least 8 characters"` (for medium level)
- `"At least 12 characters"` (for high level)
- `"Maximum 64 characters"`
- `"At least one uppercase letter"`
- `"At least one lowercase letter"`
- `"At least one number"`
- `"At least one symbol"`
- `"Only letters and numbers allowed"`
- `"No repeated characters (3+ consecutive)"`
- `"Passwords do not match"`

## License

MIT © Bennu
