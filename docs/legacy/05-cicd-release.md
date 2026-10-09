# CI / CD & Release Process

> **Status: ✅ Implemented** — all workflows are live with pinned SHA actions.

---

## Workflow inventory

| File                 | Trigger                            | Purpose                                                       |
| -------------------- | ---------------------------------- | ------------------------------------------------------------- |
| `ci.yml`             | PR + push to `main`                | Dedupe check, format, lint, build + test, typecheck           |
| `release-please.yml` | Push to `main`                     | Opens / updates a Release PR via Release Please               |
| `publish.yml`        | Tag push `theme-v*` / `toolbar-v*` | Build, test, publish to npm under `next`; promote to `latest` |
| `deploy-site.yml`    | Tag push (non-RC)                  | Build + deploy showcase site to Netlify                       |
| `dco.yml`            | PR open / comment                  | Developer Certificate of Origin check                         |

> **Note:** Workflow structure differs from the original plan. Changesets was replaced by **Release Please** (`googleapis/release-please-action`). Version bumping is automated by Release Please opening a PR on each push to `main`; there is no manual `version.yml` dispatch workflow.

---

## CI jobs (`ci.yml`)

1. **dedupe** — `pnpm dedupe --check` lockfile integrity
2. **format** — `pnpm format:check` (Prettier)
3. **lint** — `pnpm lint` (ESLint)
4. **test** — `pnpm build` + `pnpm --filter @carbon/echarts-theme test:coverage` + Codecov upload
5. **typecheck** — `pnpm typecheck`

> ⚠️ AVT (IBM Equal Access) job was planned but not implemented in CI.

---

## Release flow

1. Develop on feature branches; PRs to `main` pass all CI checks and DCO.
2. Merge to `main` — Release Please automatically opens or updates a Release PR.
3. Review + merge the Release PR.
4. Release Please creates a tag (`theme-v<version>` or `toolbar-v<version>`).
5. Tag push triggers `publish.yml` → publishes under `next` dist-tag.
6. `promote` job (within `publish.yml`) promotes to `latest` if tag is not an RC.
7. Same non-RC tag triggers `deploy-site.yml` → site updated.

---

## Required secrets

| Secret                                    | Used by              | Notes                                                                         |
| ----------------------------------------- | -------------------- | ----------------------------------------------------------------------------- |
| `RELEASE_PLEASE_TOKEN`                    | `release-please.yml` | PAT for Release Please to open PRs                                            |
| `CARBON_BOT_NPM_TOKEN`                    | `publish.yml`        | npm publish token for `@carbon` org scope                                     |
| `CODECOV_TOKEN`                           | `ci.yml`             | Coverage upload                                                               |
| `GITHUB_TOKEN`                            | `dco.yml`            | Built-in, no setup needed                                                     |
| `WS_APIKEY` / `WS_USERKEY` / `WS_WSS_URL` | Not yet wired        | IBM Mend credentials — tracked in `.github/ISSUE_TEMPLATE/mend-scan-setup.md` |

---

## Mend scan

Not implemented. Tracked in `.github/ISSUE_TEMPLATE/mend-scan-setup.md`. Requires IBM PSIRT product registration before wiring.

---

## Community health files

| File                               | Status                 |
| ---------------------------------- | ---------------------- |
| `.github/PULL_REQUEST_TEMPLATE.md` | ✅ Exists              |
| `.github/CONTRIBUTING.md`          | ❌ Not created         |
| `.github/SECURITY.md`              | ❌ Not created         |
| `.github/CODE_OF_CONDUCT.md`       | ❌ Not created         |
| `.github/SUPPORT.md`               | ❌ Not created         |
| `LICENSE`                          | ✅ Exists (Apache-2.0) |
| `README.md`                        | ✅ Exists              |
| `.nvmrc`                           | ✅ Exists              |
