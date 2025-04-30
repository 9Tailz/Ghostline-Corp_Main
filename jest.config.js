// jest.config.js
module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    // transform JS, JSX, TS, TSX with babel-jest
    '^.+\.(js|jsx|ts|tsx)': 'babel-jest',
    },
    moduleNameMapper: {
    // mock CSS imports
    '\\.(css|scss)': 'identity-obj-proxy',
    // map @/ to <rootDir>/src/
    '^@/(.*)$': '<rootDir>/src/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    };