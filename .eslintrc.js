module.exports = {
  extends: ['custom'],
  parserOptions: {
    project: ['./tsconfig.json', 'packages/*/tsconfig.json', 'apps/*/tsconfig.json'],
  },
}
