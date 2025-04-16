# CL Validators

A TypeScript utility package for validating and formatting Chilean identification and business data.

[![Version](https://img.shields.io/npm/v/common-js?logo=npm)](https://www.npmjs.com/bennu/common-js)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Downloads](https://img.shields.io/npm/dm/common-js)](https://www.npmjs.com/bennu/common-js)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/common-js)](https://bundlephobia.com/bennu/common-js)
[![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)](https://github.com/bennu/common-js)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?logo=opensourceinitiative)](https://opensource.org/license/mit)

## 📋 Features

- **Zero Dependencies** - Lightweight and efficient implementation
- **TypeScript Native** - Full type definitions and type safety


## 🚀 Installation

```bash
# Using npm
npm install common-js

# Using yarn
yarn add common-js

# Using pnpm
pnpm add common-js
```

## 💻 Usage

### JavaScript (CommonJS)

```javascript
const { isValidRut } = require('common-js');

// Basic validation
console.log(isValidRut('12.345.678-5')); // true
```

### TypeScript / ES Modules

```typescript
import { isValidRut} from 'common-js';

// Basic validation
console.log(isValidRut('12.345.678-5')); // true
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.