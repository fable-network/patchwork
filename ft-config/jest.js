module.exports = {
  timers: 'fake',
  globals: {
    fashionTradeSettings: true,
    __DEV__: true,
  },
  collectCoverageFrom: ['src/**/*.{js}', '!src/**/*.test.{js}', '!src/app.js'],
  coverageReporters: ['json', 'lcov', 'text-summary'],
  modulePaths: ['/src/components'],
  moduleDirectories: ['node_modules', 'src', 'src/components'],
  moduleNameMapper: {
    '^.+\\.(css|scss)$': 'babel-jest',
    'react-i18next': '<rootDir>/__mocks__/react-i18next.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/file.js',
  },
  setupFiles: ['<rootDir>/ft-config/test-setup.js'],
  setupTestFrameworkScriptFile: 'jest-enzyme',
  testEnvironment: 'enzyme',
  testMatch: [
    '<rootDir>/src/**/*.(specs|spec|test).js',
    '<rootDir>/.storybook/**/*.(specs|spec|test).js',
  ],
  verbose: true,
  testURL: 'http://localhost/',
  snapshotSerializers: ['enzyme-to-json/serializer'],
  transformIgnorePatterns: ['node_modules/(?!(@storybook/addon-centered)/)'],
};
