# P0 OpenAI Vercel Setup

Mingyi P0 is code-complete, but production is not AI-ready until Vercel has `OPENAI_API_KEY`.

## Add Environment Variables

1. Open Vercel.
2. Go to project `mingyi-bazi-mvp`.
3. Open `Settings` -> `Environment Variables`.
4. Add:
   - `OPENAI_API_KEY`: your OpenAI API key.
   - `OPENAI_MODEL`: `gpt-5.2-mini` optional; the app has this default.
5. Select `Production`, `Preview`, and `Development` if Vercel asks which environments should receive the value.
6. Save.
7. Redeploy the latest production deployment.

## Verify

Run from `D:\文档\算命\mvp-bazi-web`:

```powershell
npm run smoke:p0
```

Expected result:

```text
P0 production smoke passed.
```

If the script fails on `OPENAI_API_KEY`, the key was not added to the deployed environment or the project needs a redeploy.
