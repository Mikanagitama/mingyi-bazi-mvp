# P0/P1 AI Provider Vercel Setup

Mingyi production uses DeepSeek by default. OpenAI remains supported only as an optional fallback when `AI_PROVIDER=openai`.

P0 has already been verified with DeepSeek on production. Keep these settings stable while moving toward P1.

## Add Environment Variables

1. Open Vercel.
2. Go to project `mingyi-bazi-mvp`.
3. Open `Settings` -> `Environment Variables`.
4. If you use DeepSeek but pasted the key into `OPENAI_API_KEY`, this is supported. Add:
   - `OPENAI_API_KEY`: your DeepSeek API key.
   - `AI_PROVIDER`: `deepseek` optional; DeepSeek is the default provider for this MVP.
   - `DEEPSEEK_MODEL`: `deepseek-v4-flash` optional; this is the default.
5. Alternative DeepSeek naming also works:
   - `DEEPSEEK_API_KEY`: your DeepSeek API key.
   - `DEEPSEEK_MODEL`: `deepseek-v4-flash`
6. If you use OpenAI instead, add:
   - `OPENAI_API_KEY`: your OpenAI API key.
   - `OPENAI_MODEL`: `gpt-5.2-mini`
7. Select `Production`, `Preview`, and `Development` if Vercel asks which environments should receive the value.
8. Save.
9. Redeploy the latest production deployment.

## P1 Rules

- Keep DeepSeek as the default provider.
- Do not expose AI keys to frontend code.
- Do not change the 8-section report contract without explicit product approval.
- AI generation must keep deterministic Bazi calculation as the source of chart truth.
- If AI fails, the fallback report may be shown, but internal provider errors should not be shown to customers.

## Verify

Run from `D:\文档\算命\mvp-bazi-web`:

```powershell
npm run smoke:p0
```

Expected result:

```text
P0 production smoke passed.
```

If the script fails on the AI key, the key was not added to the deployed environment, `AI_PROVIDER` does not match the key type, or the project needs a redeploy.
