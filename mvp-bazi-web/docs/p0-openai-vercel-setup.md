# P0 AI Provider Vercel Setup

Mingyi P0 is code-complete, but production is not AI-ready until Vercel has an AI provider key.

## Add Environment Variables

1. Open Vercel.
2. Go to project `mingyi-bazi-mvp`.
3. Open `Settings` -> `Environment Variables`.
4. If you use DeepSeek but pasted the key into `OPENAI_API_KEY`, add these variables:
   - `OPENAI_API_KEY`: your DeepSeek API key.
   - `AI_PROVIDER`: `deepseek`
   - `DEEPSEEK_MODEL`: `deepseek-v4-flash`
5. Alternative DeepSeek naming also works:
   - `DEEPSEEK_API_KEY`: your DeepSeek API key.
   - `DEEPSEEK_MODEL`: `deepseek-v4-flash`
6. If you use OpenAI instead, add:
   - `OPENAI_API_KEY`: your OpenAI API key.
   - `OPENAI_MODEL`: `gpt-5.2-mini`
7. Select `Production`, `Preview`, and `Development` if Vercel asks which environments should receive the value.
8. Save.
9. Redeploy the latest production deployment.

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
