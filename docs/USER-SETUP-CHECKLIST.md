# 你需要准备什么：国际版八字 MVP 上线账号清单

日期：2026-07-06

这份清单是给非技术用户看的。你不用理解全部技术细节，只需要按顺序准备账号和授权。我来负责代码、配置、测试、部署命令和排查。

## 一句话版本

你需要准备 4 样东西：

1. GitHub：放代码。
2. Vercel：把网站部署到公网。
3. Supabase 或 Neon：保存用户命盘和付款状态。
4. Stripe：收 $2.99，并把支付成功通知网站。

域名可以先不买，第一版可以先用 Vercel 免费给的网址。

## 第 1 步：GitHub

用途：

- 保存代码。
- 让 Vercel 能自动部署。

你需要做：

1. 打开 https://github.com/
2. 注册或登录账号。
3. 告诉我你想用哪个仓库名。

建议仓库名：

```text
mingyi-bazi-mvp
```

我需要你提供：

```text
GitHub 用户名：
仓库名：
仓库公开还是私有：建议 private
```

## 第 2 步：Vercel

用途：

- 把网站上线到公网。
- 生成一个可以访问的网址。
- 自动运行 Next.js 后端接口。

你需要做：

1. 打开 https://vercel.com/
2. 用 GitHub 登录 Vercel。
3. 授权 Vercel 访问刚才的 GitHub 仓库。

导入项目时关键设置：

```text
Framework Preset: Next.js
Root Directory: mvp-bazi-web
Build Command: npm run build
Install Command: npm install
```

我需要你提供：

```text
Vercel 登录是否完成：是/否
Vercel 项目名：
Vercel 自动生成的网址：
```

## 第 3 步：Supabase 或 Neon 数据库

用途：

- 保存用户生成的 reading_id。
- 保存免费报告和完整报告。
- 保存付款状态，确保付费后刷新页面仍然能看到完整报告。

推荐你用 Supabase，因为界面对新手更友好。

你需要做：

1. 打开 https://supabase.com/
2. 用 GitHub 登录。
3. 创建一个新项目。
4. 找到数据库连接字符串，也就是 `DATABASE_URL`。

项目名建议：

```text
mingyi-bazi
```

数据库区域建议：

```text
美国区域，例如 US East
```

你需要给我的不是账号密码截图，而是这一项：

```text
DATABASE_URL=postgresql://...
```

拿到后我会运行：

```powershell
cd D:\文档\算命\mvp-bazi-web
$env:DATABASE_URL='你的 Postgres 连接字符串'
npm run db:setup
```

## 第 4 步：Stripe

用途：

- 收 $2.99。
- 使用 Stripe Checkout 安全付款页面。
- 支付成功后通过 webhook 通知网站解锁完整报告。

你需要做：

1. 打开 https://stripe.com/
2. 注册或登录账号。
3. 先使用 Test mode，不急着开正式收款。
4. 创建产品：

```text
Product name: Full Bazi Reading
Price: 2.99
Currency: USD
Payment type: One-time
```

你需要给我：

```text
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
```

等 Vercel 有公网网址后，再创建 webhook：

```text
Endpoint URL:
https://你的-vercel网址/api/stripe/webhook

Event:
checkout.session.completed
```

然后你需要给我：

```text
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 第 5 步：Vercel 环境变量

这些值最终都要放进 Vercel 项目的 Environment Variables：

```text
DATABASE_URL=
STRIPE_SECRET_KEY=
STRIPE_PRICE_ID=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_SITE_URL=
OPENAI_API_KEY=
```

说明：

- `OPENAI_API_KEY` 第一版可以先不填，因为当前完整报告用模板生成。
- 其他 5 个正式上线前必须有。
- `NEXT_PUBLIC_SITE_URL` 就是 Vercel 给你的公网网址。

## 最推荐的执行顺序

### 先上线无支付预览

1. GitHub 准备好。
2. Vercel 登录并授权。
3. 我先部署网站。
4. 拿到 Vercel 网址。

### 再接数据库

1. 你开 Supabase。
2. 给我 `DATABASE_URL`。
3. 我运行 `npm run db:setup`。
4. 我把 `DATABASE_URL` 配进 Vercel。

### 最后接 Stripe 测试支付

1. 你开 Stripe。
2. 给我 test secret key 和 price id。
3. 我配置 Vercel。
4. 我用 Vercel 网址创建 webhook。
5. 你给我 webhook secret。
6. 我跑完整 $2.99 test payment。

## 你发给我的信息模板

复制下面这段，填你知道的就行，不知道先空着：

```text
GitHub 用户名：
GitHub 仓库名：mingyi-bazi-mvp

Vercel 是否已用 GitHub 登录：
Vercel 项目名：
Vercel 网址：

Supabase 是否已创建项目：
DATABASE_URL：

Stripe 是否已注册：
STRIPE_SECRET_KEY：
STRIPE_PRICE_ID：
STRIPE_WEBHOOK_SECRET：
```

## 注意

- 不要把银行卡信息、身份证件、Stripe 登录密码发给我。
- Test mode 的 Stripe key 可以用于测试，不会真实扣款。
- Live mode 正式收款前，我会单独提醒你，不会默认打开。
- 第一版可以先用 Vercel 免费网址，不需要马上买域名。

## 官方参考

- Vercel GitHub 部署：https://vercel.com/docs/git/vercel-for-github
- Vercel 环境变量：https://vercel.com/docs/environment-variables
- Supabase 数据库连接：https://supabase.com/docs/guides/database/connecting-to-postgres
- Supabase Postgres.js 连接建议：https://supabase.com/docs/guides/database/postgres-js
- Stripe Checkout：https://docs.stripe.com/payments/checkout
- Stripe Webhooks：https://docs.stripe.com/webhooks
