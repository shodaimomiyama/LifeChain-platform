// jest.config.cjs
module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/test/**/*.test.mjs'],
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.js'],
    transform: {},
    moduleFileExtensions: ['js', 'mjs'], //Jestが認識するファイル拡張子
};