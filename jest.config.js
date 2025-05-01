// jest.config.js
module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.[jt]sx?$': [
      'babel-jest',
      {
        presets: ['next/babel'],
      },
    ],
  },
    moduleNameMapper: {
    // mock CSS imports
    '\\.(css|scss)': 'identity-obj-proxy',
    // map @/ to <rootDir>/src/
    '^@/(.*)$': '<rootDir>/src/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    };