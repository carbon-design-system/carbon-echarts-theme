export default {
  '**/*.{js,mjs,cjs,jsx,ts,tsx}': ['prettier --write', 'eslint --fix --max-warnings=0'],
  '**/*.{json,md,mdx,yml,yaml,css,scss}': ['prettier --write'],
  // tsc doesn't accept individual file paths — the () => ignores lint-staged's
  // file list and runs the full monorepo typecheck instead.
  '**/*.ts?(x)': () => 'pnpm typecheck',
}
