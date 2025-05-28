module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleNameMapper: {
    '^@components(.*)$': '<rootDir>/src/components$1',
    '^@pages(.*)$': '<rootDir>/src/pages$1',
    '^@ui(.*)$': '<rootDir>/src/components/ui$1',
    '^@utils-types(.*)$': '<rootDir>/src/utils/types$1',
    '^@api(.*)$': '<rootDir>/src/utils/burger-api$1' // Исправляем путь на burger-api
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
