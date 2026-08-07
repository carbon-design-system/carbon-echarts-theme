export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    // Restrict scopes to package names so release-please bumps the right package.
    // 'deps' and 'release' are meta-scopes for dependabot / release-please commits.
    'scope-enum': [
      2,
      'always',
      ['theme', 'toolbar', 'codemods', 'site', 'deps', 'release', 'repo'],
    ],
  },
}
