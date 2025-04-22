"use strict";
/**
 * Chilean RUT Validator
 * A TypeScript package to validate Chilean RUT (Rol Único Tributario) numbers.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateVerificationDigit = exports.cleanRut = exports.isValidRut = void 0;
var validate_chilean_rut_1 = require("./validate-chilean-rut");
Object.defineProperty(exports, "isValidRut", { enumerable: true, get: function () { return validate_chilean_rut_1.isValidRut; } });
Object.defineProperty(exports, "cleanRut", { enumerable: true, get: function () { return validate_chilean_rut_1.cleanRut; } });
Object.defineProperty(exports, "calculateVerificationDigit", { enumerable: true, get: function () { return validate_chilean_rut_1.calculateVerificationDigit; } });
