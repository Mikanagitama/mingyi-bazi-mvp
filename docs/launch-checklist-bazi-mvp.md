# 国际版八字 MVP 上线清单

日期：2026-07-06

## 当前已完成

- 已创建独立 Next.js 项目：`mvp-bazi-web/`
- 默认英文首页：`/`
- 中文首页：`/zh`
- 免费八字输入页：`/reading/new`
- 免费报告页：`/reading/[id]`
- 付费完整报告页：`/reading/[id]/full`
- Stripe Checkout 创建接口：`POST /api/checkout`
- Stripe webhook 接口：`POST /api/stripe/webhook`
- 部署健康检查：`GET /api/health`
- 部署前门禁：`npm run preflight`
- 数据库初始化：`npm run db:setup`
- Vercel 项目配置：`mvp-bazi-web/vercel.json`
- 隐私政策：`/privacy`
- 服务条款：`/terms`
- 免责声明：`/disclaimer`

## 已验证

```powershell
cd mvp-bazi-web
npm test
npm run build
npm run db:setup:dry
npm run verify
```

验证结果：

- `npm test`：9 个测试通过
- `npm run build`：Next.js 生产构建通过
- `npm run db:setup:dry`：数据库 schema dry-run 通过
- Supabase `DATABASE_URL` 已在本地 `.env.local` 填写，并且 `npm run db:setup` 已成功完成建表
- `npm run verify`：测试、构建、preflight 脚本冒烟全部通过
- 本地首页 `/` 返回 200
- 本地中文首页 `/zh` 返回 200
- `POST /api/readings` 可生成免费八字预览
- 浏览器生成流程可从表单跳转到 `/reading/{id}`
- 未付费报告不会泄露完整报告正文
- 未配置 Stripe 时，解锁按钮返回明确错误，不会伪造支付成功
- 桌面和 390px 移动端无横向溢出
- `/api/health` 在缺少部署配置时返回 `ok: false` 和明确 blocker
- `npm run preflight` 在缺少生产环境变量时会失败并列出缺失项
- GitHub 仓库已绑定并推送到 `Mikanagitama/mingyi-bazi-mvp` 的 `main` 分支

## 上线前必须准备

### GitHub

- 创建或选择 GitHub 仓库
- 推送当前项目
- Vercel 导入时将 Project Root 设置为 `mvp-bazi-web`

### 数据库

推荐使用 Supabase 或 Neon Postgres。

需要执行：

```sql
-- mvp-bazi-web/src/lib/db/schema.sql
```

需要配置：

```text
DATABASE_URL
```

配置后执行：

```powershell
cd mvp-bazi-web
$env:DATABASE_URL='postgres 连接字符串'
npm run db:setup
```

执行成功后会创建/确认：

- `readings`
- `payments`

### Stripe

需要在 Stripe Dashboard 创建：

- Product：`Full Bazi Reading`
- Price：`2.99 USD`
- Mode：one-time payment

需要配置：

```text
STRIPE_SECRET_KEY
STRIPE_PRICE_ID
STRIPE_WEBHOOK_SECRET
```

Webhook endpoint：

```text
https://你的域名/api/stripe/webhook
```

监听事件：

```text
checkout.session.completed
```

### Vercel

需要配置：

```text
NEXT_PUBLIC_SITE_URL=https://你的域名
DATABASE_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=
OPENAI_API_KEY=
```

第一版完整报告当前使用结构化模板生成，不依赖 AI；`OPENAI_API_KEY` 保留给后续升级。

部署前在 `mvp-bazi-web/` 执行：

```powershell
npm run preflight
```

只有所有必需环境变量都配置后才应继续 Vercel Production 部署。

## 生产验收

- 英文首页可公网访问
- 中文首页可公网访问
- 免费报告可生成
- 未付费访问 `/reading/[id]/full` 仍显示锁定/预览
- Stripe test mode 可以完成 $2.99 支付
- webhook 成功后报告变为 paid
- paid 报告刷新后仍可访问
- 移动端 390px 宽度无横向滚动
- 隐私、条款、免责声明可访问
- `/api/health` 返回 `ok: true`

## 当前阻塞项

外部上线需要用户提供或完成：

- Vercel 账号/项目授权
- Stripe test key、price id、webhook secret

在没有这些外部凭证前，本地 MVP 已可运行，但不能完成真实公网部署和 Stripe test checkout。

已检查 Vercel CLI：

- `npx --yes vercel@latest whoami`
- 结果：本机未发现 Vercel 登录凭证，CLI 进入登录流程后失败
- 结论：需要用户先完成 Vercel 登录或提供可用的部署授权方式

已检查本机上线依赖：

- GitHub remote：已绑定并成功推送
- `STRIPE_SECRET_KEY`：未配置
- `STRIPE_WEBHOOK_SECRET`：未配置
- `STRIPE_PRICE_ID`：未配置
- `DATABASE_URL`：未配置
- `NEXT_PUBLIC_SITE_URL`：未配置
