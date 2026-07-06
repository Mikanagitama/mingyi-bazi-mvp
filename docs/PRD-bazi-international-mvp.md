# 国际版八字解读 MVP PRD

版本：v0.1  
日期：2026-07-06  
状态：开发中，已创建独立可部署 MVP 目录 `mvp-bazi-web/`  
本轮范围：实现国际版八字 MVP、准备 Vercel 部署；正式外部上线需要 Vercel/Stripe/GitHub 凭证  

## 1. 一句话目标

做一个面向海外用户的双语八字解读 MVP：

> 默认英文，支持中文；免费先解锁一部分八字报告，付费 2.99 美金解锁完整解读。

这个 MVP 的目标不是一开始就做成青囊那种大平台，而是先上线一个能跑通真实用户路径的产品：

1. 海外用户打开网站。
2. 默认看到英文页面。
3. 输入生日、时间、性别。
4. 免费得到八字盘和部分解读。
5. 觉得有价值后支付 $2.99。
6. 解锁完整报告。
7. 可以保存/复制/下载报告。

## 2. 关键产品决策

### 2.1 第一版只做八字，不做紫微

原因：

- 八字在海外更容易解释为 “Four Pillars of Destiny”，认知门槛低于紫微斗数。
- 八字输入更直观：出生年月日时。
- 当前落地页素材已经是 Bazi Destiny 风格，和八字产品更匹配。
- 商业化时，八字报告可以拆成清晰模块：personality、career、wealth、relationships、yearly forecast。

### 2.2 面向外国人，默认英文

默认语言规则：

- 国际站默认英文。
- 如果用户手动切换中文，则记住偏好。
- 如果浏览器语言是中文，可以提示 “切换中文”，但不要默认切中文。

URL 建议：

- `/` 英文首页
- `/zh` 中文首页
- `/reading` 英文排盘/报告
- `/zh/reading` 中文排盘/报告

内容策略：

- 英文不是逐字翻译中文命理术语，而是解释文化概念。
- 例如：
  - 八字：Four Pillars
  - 日主：Day Master
  - 十神：Ten Gods / Relationship Archetypes
  - 大运：10-Year Luck Cycle
  - 流年：Annual Influence

### 2.3 不要户籍地

产品不收集户籍地。

原因：

- 外国用户没有“户籍地”概念。
- 户籍地和八字排盘本身无关，容易增加隐私顾虑。
- 对商业化转化是负担。

MVP 输入只收集：

- Name / Display name，可选
- Gender，可选或用于传统排盘口径
- Birth date
- Birth time
- Calendar：默认 Gregorian / 公历
- Language preference

出生地也不作为 MVP 必填。

说明：

- 传统命理里，真太阳时可能需要出生地。
- 但海外 MVP 为降低摩擦，第一版不强制地点。
- 页面中可以用一句话说明：“For advanced solar-time correction, birth location may be added in a future version.”

## 3. 什么是 Vercel

Vercel 是一个网站部署平台。你可以把代码放到 GitHub，然后 Vercel 自动构建、部署，并给你一个公网网址。它适合快速上线前端网站、Next.js 应用、API 路由和轻量 AI 产品。

你可以把它理解成：

> 写好网站 → 推到 GitHub → Vercel 自动上线 → 全世界用户能访问。

根据 Vercel 官方价格页，Hobby 是 $0/月，适合 web app 或个人项目；Pro 是 $20/月，面向需要构建和扩展 app 的场景，并包含 $20 用量额度。Vercel 也提供全球 CDN、自动部署、防护、Serverless Functions 等能力。

MVP 建议：

- 如果只是先试水、没有真实商业收入，可以先用 Vercel Hobby 验证页面和用户反馈。
- 如果要正式收款、投放、接入支付和 AI API，建议使用 Vercel Pro，避免商业用途、用量和稳定性上的限制。

参考：

- Vercel Pricing: https://vercel.com/pricing
- Vercel Functions: https://vercel.com/docs/functions
- Vercel Environment Variables: https://vercel.com/docs/environment-variables

## 4. 收款方案怎么设计

### 4.1 推荐：Stripe Checkout

第一版推荐 Stripe Checkout，不推荐自己手写信用卡表单。

原因：

- Stripe Checkout 是官方预构建支付页面。
- 支持一次性付款。
- 支持多种支付方式。
- 用户点击购买后跳转到 Stripe 托管的付款页。
- 支付成功后跳回你的网站。
- 安全合规压力比自建卡表单低。

Stripe 官方文档说明 Checkout 可用于 one-time payments，也可用 Checkout Sessions API 创建预构建支付页。Stripe 在线支付文档也指出 Checkout Sessions 比 Payment Intents 更适合完整 checkout 流程，因为税费、折扣、订单摘要、receipt、webhook 生命周期等能力更完整；Payment Intents 更底层，需要自己维护更多 checkout 逻辑。

参考：

- Stripe Checkout: https://docs.stripe.com/payments/checkout
- Stripe Online Payments: https://docs.stripe.com/payments/online-payments
- Stripe US Pricing: https://stripe.com/us/pricing

### 4.2 $2.99 是否合适

你的直觉是对的：$2.99 适合第一个 MVP。

优点：

- 冲动消费门槛低。
- 海外用户对 $2.99 的心理阻力较小。
- 适合验证“愿不愿意为完整报告付费”。

风险：

- 单笔金额低，支付手续费占比会高。
- Stripe US 标准价格页显示 domestic cards 是 2.9% + 30¢。如果以 $2.99 粗算，仅固定 30¢ 就约占 10%。不同国家、跨境卡、税费可能更高。
- AI 成本如果太高，$2.99 可能覆盖不了完整长报告生成。

建议：

- 第一个 MVP 保持 $2.99，但控制生成成本。
- 不要一开始给无限追问。
- 完整报告长度控制在 1500-2500 英文词以内。
- 如果后续 AI 成本或退款压力上升，再测试 $4.99。

### 4.3 免费/付费解锁边界

免费展示：

- 八字四柱
- 五行分布
- Day Master / 日主
- 简短 personality overview
- 事业/财富/关系各 1-2 句 teaser
- 1 个年度概览 teaser
- 明确提示完整报告包含什么

付费解锁：

- 完整 personality reading
- Career & wealth
- Relationships
- Health & energy
- Yearly forecast
- Lucky elements / colors / directions
- Practical advice
- Full bilingual report
- Copy/download

不建议免费层太空。

免费层必须让用户感觉：

> “这东西确实读到了我一点，所以 $2.99 可以试试。”

### 4.4 支付状态设计

MVP 不需要复杂账户系统，但必须能判断用户是否已付费。

最小方案：

1. 用户生成免费报告。
2. 系统创建 `reading_id`。
3. 用户点击 Unlock Full Reading。
4. 后端创建 Stripe Checkout Session。
5. Stripe 返回 checkout URL。
6. 用户付款。
7. Stripe webhook 通知后端支付成功。
8. 后端把 `reading_id` 标记为 paid。
9. 用户回到 `/reading/:id?session_id=...`。
10. 页面显示完整报告。

MVP 必须有 webhook，不能只靠前端跳转判断支付成功。

原因：

- 只靠 success URL 容易被伪造。
- webhook 才是支付真实完成的后端凭证。

### 4.5 不做登录可以吗

第一个 MVP 可以不做完整登录。

推荐做“邮箱 + magic link / report link”：

- 用户付费时 Stripe 会收 email。
- 支付成功后，把报告绑定到 email。
- 给用户一个 private report link。
- 用户下次可以通过邮箱找回报告。

第一版避免：

- 密码登录
- 复杂会员中心
- 订阅
- 积分系统

## 5. MVP 用户流程

### 5.1 英文默认流程

1. 用户访问首页。
2. 默认英文落地页。
3. CTA：Get My Bazi Reading。
4. 进入输入表单。
5. 输入 birth date / birth time / gender。
6. 点击 Generate Free Reading。
7. 系统生成免费报告。
8. 用户看到一部分内容被锁住。
9. CTA：Unlock Full Reading — $2.99。
10. 跳转 Stripe Checkout。
11. 支付成功后回到完整报告。

### 5.2 中文流程

1. 用户点击中文切换。
2. 页面文案变中文。
3. 输入项保留相同结构。
4. 免费报告中文展示。
5. 付费解锁中文完整报告。

### 5.3 语言策略

用户可以在结果页切换语言。

建议规则：

- 免费报告生成时保存 `language=en` 或 `language=zh`。
- 付费后生成对应语言完整报告。
- 如果用户切换语言，完整报告可重新渲染，但不要重复收费。

## 6. MVP 功能范围

### 6.1 必须做

#### A. 国际首页

页面内容：

- Hero
- What You Will Discover
- How It Works
- Sample Report
- Privacy/secure messaging
- CTA to reading
- Language switch

当前水墨首页可以保留，但需要改成真实 DOM，而不是只靠整张图片。

原因：

- SEO 需要真实文字。
- 多语言需要文本可切换。
- 移动端体验更可控。
- 未来 A/B 测试需要可编辑组件。

MVP 可折中：

- 上线初期继续用图片作为视觉背景。
- 但 CTA、表单、核心文案必须真实 DOM。

#### B. 八字排盘

输入：

- Name optional
- Birth date
- Birth time
- Gender optional
- Calendar：默认 Gregorian
- Language

输出：

- Four Pillars
- Day Master
- Five Elements distribution
- Ten Gods summary
- Luck cycle placeholder / simplified cycle

注意：

- 不收户籍地。
- 不强制出生地。
- 对不知道具体出生时间的用户，允许选择 “I don't know exact time”，但报告标注准确度降低。

#### C. 免费报告

免费内容：

- Your Four Pillars chart
- Your Day Master
- Five Elements balance
- Short life overview
- Locked sections preview

示例：

```text
Free Preview
- Your Day Master suggests how you naturally respond to pressure and opportunity.
- Your Five Elements show where your energy is strong or missing.
- Unlock the full report to see career, wealth, relationships, yearly forecast, and lucky guide.
```

#### D. 付费完整报告

完整报告结构：

1. Life Overview
2. Personality & Strengths
3. Career & Wealth
4. Relationships
5. Health & Energy
6. Yearly Forecast
7. Lucky Guide
8. Practical Advice
9. Technical Notes / Chinese metaphysics basis
10. Disclaimer

#### E. Stripe Checkout 付款

产品：

- `Full Bazi Reading`
- Price: `$2.99`
- Mode: one-time payment
- Currency: USD

支付成功：

- 解锁完整报告。
- 生成 paid report。
- 用户能复制或下载。

#### F. 报告持久化

最小数据：

- reading_id
- input birth data
- language
- free_report
- full_report
- payment_status
- stripe_session_id
- stripe_payment_intent
- created_at

存储建议：

- Supabase / Neon Postgres 二选一。
- 如果先极简，也可以 Vercel Postgres/Neon。

### 6.2 暂不做

第一版不做：

- 紫微
- 大六壬
- 多术数合参
- 户籍地
- 强制出生地
- 复杂登录
- 订阅
- 积分系统
- 多轮 AI 聊天
- PDF 精排版
- App Store / Play Store

## 7. 技术方案建议

### 7.1 为什么当前本地 Python 版不适合直接上线

现在的项目是本地 Python server + 静态页面，适合本机测试，但直接上线会遇到：

- Vercel 对长期 Python 服务不是传统服务器模式。
- 需要改成 serverless/API route。
- 支付 webhook 需要公网后端。
- 报告需要数据库持久化。
- 英文默认和 SEO 需要更正式的前端结构。

### 7.2 推荐技术栈

建议第一个可上线版本使用：

- Next.js
- Vercel
- API Routes / Server Actions
- Supabase 或 Neon Postgres
- Stripe Checkout
- OpenAI / 可替换 AI Provider
- 八字排盘库或自建排盘模块

原因：

- Next.js 和 Vercel 适配最好。
- 国际站 SEO 更方便。
- API routes 可以处理 Stripe checkout 和 webhook。
- 多语言路由更自然。

### 7.3 Vercel 上线步骤

上线流程：

1. 创建 GitHub 仓库。
2. 把项目改为 Next.js。
3. 连接 Vercel。
4. 设置环境变量：
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `DATABASE_URL`
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_SITE_URL`
5. 部署 Preview。
6. 测试支付沙盒。
7. 切 Stripe live key。
8. 绑定正式域名。
9. 发布。

Vercel 环境变量适合放 API keys；官方文档说明环境变量可以用于 Build Step 或 Function execution，敏感变量也可以通过 Vercel 环境变量管理。

### 7.4 数据库选择

MVP 推荐 Supabase。

原因：

- 有数据库。
- 有简单 auth。
- 有 dashboard。
- 和 Vercel 集成方便。

但第一版如果不做登录，也可以只用 Postgres 保存 reading 和 payment。

## 8. 八字解读内容设计

### 8.1 免费报告字段

英文版：

```text
Your Free Bazi Preview

1. Four Pillars
2. Day Master
3. Element Balance
4. Core Personality Snapshot
5. What the Full Report Unlocks
```

中文版：

```text
你的免费八字预览

1. 四柱
2. 日主
3. 五行分布
4. 性格底色
5. 完整报告可解锁内容
```

### 8.2 付费报告字段

英文版：

```text
Full Bazi Reading

1. Executive Summary
2. Four Pillars Chart
3. Day Master Interpretation
4. Five Elements Balance
5. Personality & Strengths
6. Career & Wealth
7. Relationships
8. Health & Energy
9. Yearly Forecast
10. Lucky Guide
11. Practical Advice
12. Cultural Notes
13. Disclaimer
```

中文版：

```text
完整八字详解

1. 总览摘要
2. 四柱命盘
3. 日主解读
4. 五行平衡
5. 性格与优势
6. 事业与财运
7. 感情关系
8. 健康与能量
9. 年度趋势
10. 幸运指南
11. 实用建议
12. 术语说明
13. 免责声明
```

### 8.3 中英双语注意点

英文版要避免直接玄学化。

差的写法：

```text
Your Day Master is weak, so your wealth luck is bad.
```

好的写法：

```text
Your Day Master appears less supported by the surrounding elements, which may indicate that consistency, recovery, and supportive environments matter more for you than forcing progress through pressure.
```

原则：

- 不说 doomed / cursed / bad luck。
- 不制造恐惧。
- 不说 guaranteed。
- 使用 tendency / may indicate / often shows / can suggest。

## 9. 解锁机制设计

### 9.1 页面展示

免费报告中显示：

- 前 25%-35% 内容开放。
- 后面模块展示标题、摘要 teaser、锁图标。
- CTA：Unlock Full Reading — $2.99。

锁定模块示例：

```text
Career & Wealth
Locked
Unlock the full report to see your best work style, money timing, and practical career guidance.
```

### 9.2 后端控制

不要只在前端隐藏。

后端必须根据 `payment_status` 决定返回：

- free report
- full report

用户未付费时，API 不返回完整报告正文。

### 9.3 支付后访问

成功支付后：

- 报告 URL：`/reading/{reading_id}/full`
- 如果未支付访问 full，则跳回 unlock 页面。
- 如果支付成功，显示完整内容。

## 10. 收款实现细节设计

### 10.1 Stripe 产品

Stripe Dashboard 创建：

- Product: Full Bazi Reading
- Price: 2.99 USD
- Type: one-time

也可以由代码用 `price_data` 创建 Checkout Session。

MVP 推荐先在 Stripe Dashboard 建固定 Price ID。

### 10.2 Checkout Session

后端创建 session 时保存：

- reading_id
- user_email optional
- language
- price_id

metadata：

```json
{
  "reading_id": "...",
  "product": "full_bazi_reading",
  "language": "en"
}
```

### 10.3 Webhook

监听：

- `checkout.session.completed`
- 可选：`payment_intent.payment_failed`

成功后：

- 查 metadata.reading_id
- 更新 reading payment_status = paid
- 生成或解锁 full_report

### 10.4 税务问题

MVP 阶段：

- Stripe Checkout 可以启用 Stripe Tax，但是否启用取决于你的主体和销售地区。
- 一开始可以先不做复杂税务自动化，但如果面向欧美真实收款，后续必须认真处理 VAT/sales tax。

PRD 决策：

- Phase 1：Stripe Checkout + 基础付款。
- Phase 2：评估 Stripe Tax / Merchant of Record 方案。

## 11. 成本和 $2.99 毛利粗算

假设 Stripe US domestic card 费率是 2.9% + 30¢：

- 收入：$2.99
- 手续费约：$0.0867 + $0.30 = $0.3867
- 到手约：$2.60，未计税、跨境、退款、AI 成本

如果 AI 生成成本控制在 $0.05-$0.25，$2.99 可以测试。

如果使用更贵模型生成长报告，利润会被吃掉。

建议：

- 报告生成一次后缓存。
- 不给无限重新生成。
- 付费报告固定结构，控制 token。
- 多轮追问放到后续更高价产品。

## 12. MVP 信息架构

页面：

- `/` English landing
- `/zh` Chinese landing
- `/reading/new`
- `/reading/[id]`
- `/reading/[id]/unlock`
- `/reading/[id]/full`
- `/success`
- `/cancel`
- `/privacy`
- `/terms`
- `/disclaimer`

API：

- `POST /api/readings`
- `GET /api/readings/:id`
- `POST /api/checkout`
- `POST /api/stripe/webhook`
- `POST /api/reports/generate`

数据库表：

### readings

- id
- name
- gender
- birth_date
- birth_time
- calendar
- language
- chart_json
- free_report_json
- full_report_json
- payment_status
- email
- created_at
- updated_at

### payments

- id
- reading_id
- stripe_session_id
- stripe_payment_intent
- amount
- currency
- status
- created_at

### report_events

- id
- reading_id
- event_type
- payload
- created_at

## 13. MVP 验收标准

### 13.1 产品验收

- 默认英文首页可访问。
- 中文版本可切换。
- 用户可以完成八字输入。
- 免费报告可生成。
- 未付费只能看到免费内容。
- 点击 $2.99 解锁进入 Stripe Checkout。
- 支付成功后完整报告解锁。
- 完整报告刷新后仍可访问。
- 移动端可用。

### 13.2 内容验收

- 英文内容自然，不像机器直译。
- 中文内容准确，不堆术语。
- 每个模块有清楚标题。
- 付费内容明显比免费内容多。
- 有免责声明。

### 13.3 技术验收

- Vercel preview 可访问。
- Vercel production 可访问。
- Stripe test mode 支付成功。
- Stripe live mode 配置完成后可真实支付。
- Webhook 可验证支付成功。
- 数据库保存 reading 和 payment。
- API key 不暴露在前端。

## 14. 不做户籍地后的准确性说明

页面 FAQ 需要解释：

英文：

```text
Do you need my birthplace?
For this MVP, no. We use your birth date and time to generate a simplified Four Pillars reading. Advanced solar-time correction may require birthplace or timezone information in a future version.
```

中文：

```text
需要户籍地吗？
不需要。本产品不收集户籍地。第一版使用出生日期和时间生成八字解读。未来如果加入真太阳时校正，可能会提供可选出生地/时区设置。
```

## 15. 上线计划

### Step 1：确认 PRD

你确认：

- 第一版只做八字。
- 默认英文。
- 中文可切换。
- 价格 $2.99。
- 不收户籍地。
- 支付用 Stripe Checkout。
- 上线用 Vercel。

### Step 2：技术改造

把当前本地项目改造成可部署结构：

- Next.js app
- i18n 文案
- 八字排盘模块
- 报告生成模块
- Stripe Checkout API
- Database schema

### Step 3：测试环境

- Vercel preview deployment
- Stripe test mode
- 测试卡付款
- Webhook test

### Step 4：正式上线

- 绑定域名
- Stripe live key
- Production env vars
- 隐私政策/服务条款/免责声明
- 小流量测试

## 16. 需要你确认的问题

在进入开发前，只需要确认下面这些：

1. 网站品牌继续用 MINGYI / Bazi Destiny 吗？
2. 第一版价格是否锁定为 $2.99？
3. 支付是否优先用 Stripe Checkout？
4. 是否同意第一版不做登录，只用 email/report link 找回报告？
5. 是否同意第一版不收户籍地，也不强制出生地？
6. 是否同意第一版上线 Vercel，先以最快速度验证市场？

## 17. 我的建议

我建议这样做：

- 品牌：继续用 MINGYI / Bazi Destiny。
- MVP：只做八字，不做紫微。
- 语言：默认英文，中文切换。
- 输入：不收户籍地，不强制出生地。
- 价格：$2.99。
- 支付：Stripe Checkout。
- 部署：Vercel。
- 登录：先不做完整账号，只保存 paid report link。
- 报告：免费预览 + 付费完整报告。

这套路线最小、最快，也最接近真实商业验证。

## 18. 参考来源

- Vercel Pricing: https://vercel.com/pricing
- Vercel Functions: https://vercel.com/docs/functions
- Vercel Environment Variables: https://vercel.com/docs/environment-variables
- Stripe Checkout: https://docs.stripe.com/payments/checkout
- Stripe Online Payments: https://docs.stripe.com/payments/online-payments
- Stripe US Pricing: https://stripe.com/us/pricing
