# Two-Factor Authentication Generator

A time-based two-factor authentication code generator for TypeScript/JavaScript applications.

## Features

- ✅ **Time-based generation** - Creates unique codes per minute using Santiago timezone
- ✅ **Configurable length** - Supports codes from 4 to 8 digits
- ✅ **Consistent algorithm** - Uses standardized multiplier-based calculation
- ✅ **TypeScript support** - Full type safety and IntelliSense

## Installation

```bash
npm install @bennu-cl/commons-js
```

## Usage

### Basic Usage

```typescript
import { generateMinutelyTwoFactor } from '@bennu-cl/commons-js'

// Generate 4-digit code (default)
const code = generateMinutelyTwoFactor()
console.log(code) // "1234"

// Generate custom length code
const code6 = generateMinutelyTwoFactor(6)
console.log(code6) // "123456"

const code8 = generateMinutelyTwoFactor(8)
console.log(code8) // "12345678"
```

### Error Handling

```typescript
import { generateMinutelyTwoFactor } from '@bennu-cl/commons-js'

try {
  const code = generateMinutelyTwoFactor(3) // Invalid length
} catch (error) {
  console.error(error.message) // "Length must be between 4 and 8."
}
```

## API Reference

### `generateMinutelyTwoFactor(length?: number): string`

Generates a time-based two-factor authentication code based on the current minute.

**Parameters:**

- `length` (optional): Length of the code to generate
  - **Type**: `number`
  - **Default**: `4`
  - **Range**: `4` to `8`

**Returns:** `string`

A numeric code of the specified length.

**Throws:** `Error`

If the length parameter is outside the valid range (4-8).

## Examples

### User Authentication

```typescript
import { generateMinutelyTwoFactor } from '@bennu-cl/commons-js'

function generateUserVerificationCode(): string {
  return generateMinutelyTwoFactor(6)
}

// Use in authentication flow
const verificationCode = generateUserVerificationCode()
console.log(`Your verification code: ${verificationCode}`)
```

### Different Code Lengths

```typescript
import { generateMinutelyTwoFactor } from '@bennu-cl/commons-js'

// Generate codes of different lengths
const codes = {
  short: generateMinutelyTwoFactor(4),   // "1234"
  medium: generateMinutelyTwoFactor(6),  // "123456"
  long: generateMinutelyTwoFactor(8)     // "12345678"
}

console.log(codes)
```

### Consistent Generation

```typescript
import { generateMinutelyTwoFactor } from '@bennu-cl/commons-js'

// Multiple calls within the same minute return identical codes
const code1 = generateMinutelyTwoFactor(6)
const code2 = generateMinutelyTwoFactor(6)

console.log(code1 === code2) // true (within same minute)
```

## Algorithm

The function uses a deterministic algorithm to ensure consistency:

1. **Timestamp**: Gets current date/time in `yyyyMMddHHmm` format using `America/Santiago` timezone
2. **Calculation**: Applies formula `(timestamp * 97 + 31)`
3. **Formatting**: Adjusts result to requested length:
   - If too short: pads with leading zeros
   - If too long: takes the last N digits

## Technical Details

- **Consistency**: Same code generated throughout the entire minute
- **Uniqueness**: Different codes generated each minute
- **Format**: Numeric digits only (0-9)
- **Length**: Guaranteed to match the specified parameter

## Use Cases

- 🔐 Two-factor authentication systems
- ⏰ Time-based temporary codes
- 🔄 Multi-system code synchronization

## Timezone Considerations

The function specifically uses `America/Santiago` timezone to ensure consistent code generation regardless of the user's local timezone. This is important for applications that need to coordinate across different geographic locations.

## License

MIT © Bennu