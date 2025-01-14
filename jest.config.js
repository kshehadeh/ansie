/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    extensionsToTreatAsEsm: ['.ts'],
    transform: {
        '^.+\\.(ts)?$': ['ts-jest', { useESM: true }],
        '^.+\\.(js)?$': ['ts-jest', { useESM: true }]
    },
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    }
};
