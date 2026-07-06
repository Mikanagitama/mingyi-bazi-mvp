# mingli-master 本地配置

已在当前目录完成本地化配置：

- skill 仓库：`mingli-master/`
- 本地 Python 环境：`.venv/`
- pip 缓存：`.pip-cache/`
- 输出目录：`.local-output/`
- 快捷脚本：`mingli-local.ps1`

## 生成排盘 JSON

```powershell
.\mingli-local.ps1 -Calendar solar -Date 1991-8-15 -Hour 1 -Gender 男 -Output .local-output\chart.json
```

农历示例：

```powershell
.\mingli-local.ps1 -Calendar lunar -Date 1991-7-6 -Hour 1 -Gender 男 -Output .local-output\chart.json
```

闰月加 `-Leap`。

## 时辰索引

`0=早子时(23-00)`，`1=丑时(01-03)`，`2=寅时(03-05)`，`3=卯时(05-07)`，
`4=辰时(07-09)`，`5=巳时(09-11)`，`6=午时(11-13)`，`7=未时(13-15)`，
`8=申时(15-17)`，`9=酉时(17-19)`，`10=戌时(19-21)`，`11=亥时(21-23)`，
`12=晚子时(23-00)`。

## Codex 自动加载说明

Codex 默认会从 `~/.codex/skills/mingli-master/` 自动加载 skill。你这次要求不写当前算命目录之外的位置，所以我没有安装到全局 skill 目录。

当前可用方式是：在这个目录里直接引用 `mingli-master/SKILL.md` 的规则，并用 `mingli-local.ps1` 生成精确排盘 JSON。

Codex 全局 skill 也已安装到 `C:\Users\86181\.codex\skills\mingli-master`。重启 Codex 后，它会进入可自动触发的 skill 列表。

## 启动网页版

```powershell
.\.venv\Scripts\python.exe .\webapp\server.py
```

然后打开：

```text
http://127.0.0.1:8765
```

网页会生成排盘、基础解读和可单独打开的 HTML 报告。

生成命盘后，页面下方会额外显示：

- 白话版：把命宫、事业、财运、感情、大限翻成日常语言
- 校准问答：填写行业、近年变化、关注重点后，生成更贴近现实的校准解释和下一轮追问

## 启动国际版八字 MVP

新的可部署 MVP 放在 `mvp-bazi-web/`，旧的 `webapp/` 本地原型保留不动。

```powershell
cd .\mvp-bazi-web
$env:npm_config_cache='D:\文档\算命\.npm-cache'
npm install
npm run dev
```

打开：

```text
http://127.0.0.1:3000
```

常用检查：

```powershell
npm test
npm run build
npm run db:setup:dry
npm run verify
```

部署配置自检：

```powershell
Invoke-RestMethod http://127.0.0.1:3000/api/health
npm run preflight
```

没有配置数据库和 Stripe 时，它会返回 `ok: false` 并列出缺少的环境变量；正式上线前必须变成 `ok: true`。

上线前需要在 Vercel 环境变量里配置：

```text
DATABASE_URL
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_ID
NEXT_PUBLIC_SITE_URL
OPENAI_API_KEY
```

拿到 Supabase/Neon 的 `DATABASE_URL` 后，可以初始化生产数据库：

```powershell
cd .\mvp-bazi-web
$env:DATABASE_URL='你的 Postgres 连接字符串'
npm run db:setup
```

当前 MVP 已包含：

- 英文默认首页和中文首页
- 不收户籍地、不强制出生地
- 免费八字预览
- 后端锁定付费内容
- Stripe Checkout 创建接口
- Stripe webhook 解锁逻辑
- `/api/health` 部署配置自检
- `npm run db:setup` 数据库建表脚本
- `npm run preflight` 部署前环境变量门禁
- `vercel.json` Vercel 构建配置
- 隐私政策、服务条款、免责声明页面
