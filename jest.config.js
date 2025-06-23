/** @type {import('jest').Config} */
module.exports = {
  // Preset para TypeScript
  preset: 'ts-jest',
  
  // Entorno de pruebas
  testEnvironment: 'node',
  
  // Archivos de prueba
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  
  // Directorios a buscar
  roots: ['<rootDir>/src', '<rootDir>/test'],
  
  // Cobertura de código
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Archivos para cobertura
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts'
  ],
  
  // Umbrales de cobertura (opcional)
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Transformaciones
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  
  // Extensiones de archivo
  moduleFileExtensions: ['ts', 'js', 'json'],
  
  // Configuración de ts-jest
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  },
  
  // Limpiar mocks automáticamente
  clearMocks: true,
  
  // Verbose output
  verbose: true
}