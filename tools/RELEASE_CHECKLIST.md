# TAIPOQ Release Checklist

Concise gate for local validation, preview, and production verification.  
Production URL: https://www.taipoq.com/

## Build

```powershell
npm run build
```

Output: `.vercel/output` (Nitro preset: vercel).  
Do **not** use Vite preview against `dist/server/server.js` — that path is not produced by this stack.

## Local production-like preview

```powershell
npm run build
npm run preview
```

Opens Nitro preview at **http://127.0.0.1:4174/** (`nitro preview --port 4174 --host 127.0.0.1`).

Alternative (equivalent):

```powershell
npx nitro preview --port 4174 --host 127.0.0.1
```

## Automated release gate (must all exit 0)

```powershell
npm run build
npm run smoke:daily-mission
npm run smoke:typing-analysis
npm run smoke:mock-foundation
npm run smoke:pack-02
npm run smoke:pack-02-foundation
npm run smoke:ga-gs-foundation
npm run smoke:welcome
npm run validate:tests
npm run validate:pack-02
npm run validate:pack-02-foundation
npm run validate:ga-gs-foundation
npm run validate:vacancies
npx tsx tools/validate-daily-mission-logic.ts
npx tsx tools/validate-typing-analysis.ts
```

`validate:vacancies` may report preview-data **warnings** (non-blocking if unchanged categories).

## Browser smoke (optional, requires Playwright once)

```powershell
npx playwright install chromium
npm run build
npm run preview
# separate terminal:
npm run smoke:browser-release
```

Override preview URL: `QA_BASE_URL=http://127.0.0.1:4174 npm run smoke:browser-release`

## Production smoke (read-only, explicit URL required)

```powershell
npx playwright install chromium
TAIPOQ_SMOKE_URL=https://www.taipoq.com npm run smoke:production
```

Or:

```powershell
node tools/smoke-test-production.mjs --url https://www.taipoq.com
```

Does not submit tests, click external apply links, or mutate server data.

## Untracked local policy

Keep untracked (do not commit):

- `backups/` — local pre-change snapshots
- Desktop release reports (`TAIPOQ_*_REPORT.txt`)

## Vercel deployment verification

After `git push origin main`:

1. Confirm GitHub commit status **Vercel** = success for the pushed SHA.
2. Open production URL and spot-check `/`, `/daily-mission`, one hub test, Pack 02, GA/GS.
3. Run production smoke (above) if Playwright is available.

## Rollback

- Git rollback point before Phase 1–7 release window: `89c6e23`
- Vercel: Deployments → previous production deployment → **Promote to Production**
- Do **not** force-push `main`; use `git revert` for history correction if needed.

## Known limitations (documented, non-blocking)

- Pack 02 mock result does not persist after refresh
- Vacancy preview JSON may emit data-quality warnings (see `npm run validate:vacancies`)
- Full Hindi/KrutiDev browser depth may rely on `validate-typing-analysis.ts` between releases
