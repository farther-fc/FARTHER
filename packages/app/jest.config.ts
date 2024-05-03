import type { Config } from "jest";

const config: Config = {
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  moduleFileExtensions: ["ts", "js"],
  moduleNameMapper: {
    "^d3-(.*)$": `<rootDir>/node_modules/d3-$1/dist/d3-$1`,
    "^@components/(.*)$": "<rootDir>/components/$1",
    "^@lib/(.*)$": "<rootDir>/lib/$1",
    "^@styles/(.*)$": "<rootDir>/styles/$1",
  },
  // transformIgnorePatterns: [`/node_modules/(?!d3|d3-scale)`],
  transform: {
    "^.+\\.(ts|tsx)$": "./node_modules/ts-jest/preprocessor.js",
  },
  testMatch: ["**/*.test.(ts|js)"],
  testEnvironment: "node",
};

export default config;
