import Link from "next/link";
import { en } from "@/lib/i18n/en";
import { zh } from "@/lib/i18n/zh";
import { homeHref, langFromSearchParams } from "@/lib/i18n/routing";

export default async function MethodologyPage({
  searchParams
}: {
  searchParams?: Promise<{ lang?: string | string[] }>;
}) {
  const language = langFromSearchParams(searchParams ? await searchParams : {});
  const copy = language === "zh" ? zh : en;
  return (
    <main className="legalPage">
      <Link href={homeHref(language)}>MINGYI</Link>
      <h1>{copy.legal.methodology}</h1>
      {language === "zh" ? (
        <>
          <p>MINGYI 把排盘和解读分开处理。四柱命盘由确定性的历法逻辑生成；AI 文本只在配置可用时，用来把结构化命盘解释成白话内容。</p>
          <p>当前引擎使用公历出生输入，通过 lunar-typescript 转换为中国历法 EightChar 数据。报告会保存四柱、日主、五行、十神、藏干、纳音、流年、地支关系、时间周期和计算策略等结构字段。</p>
          <p>AI 只在命盘计算完成后解释结构化结果，不用于凭空生成四柱、日主、五行、十神或时间周期。</p>
          <p>真太阳时是可选项。出生地能匹配内置经度表时，MINGYI 会在排盘前做经度和均时差修正。出生地无法识别时，不会强行修正。</p>
          <p>如果 AI 生成不可用或没有通过安全检查，MINGYI 会回退到确定性模板报告，保证已付费访问仍可恢复。</p>
          <p>本服务用于娱乐、文化兴趣、自我反思和时间节奏参考，不构成医疗、法律、财务、投资或专业建议。</p>
        </>
      ) : (
        <>
          <p>MINGYI separates calculation from interpretation. The Four Pillars chart is produced by deterministic calendar logic; AI text, when configured, is used only to explain the structured chart in plain language.</p>
          <p>The current engine uses Gregorian birth input converted into Chinese lunar EightChar data through lunar-typescript. The report stores structured fields including Four Pillars, Day Master, Five Elements, Ten Gods, hidden stems, Na Yin, annual transit, branch interactions, timing cycles, and calculation policy.</p>
          <p>AI explains the structured chart in natural language after the chart is calculated. AI is not used to invent the Four Pillars, Day Master, Five Elements, Ten Gods, or timing cycles.</p>
          <p>True solar time is optional. When the birthplace matches the built-in longitude table, MINGYI applies a longitude and equation-of-time correction before calculating the chart. If the birthplace cannot be resolved, no correction is forced.</p>
          <p>If AI generation is unavailable or does not pass safety checks, MINGYI falls back to a deterministic template report so paid access can still be restored.</p>
          <p>This service is for entertainment, cultural interest, self-reflection, and timing insight. It is not medical, legal, financial, investment, or professional advice.</p>
        </>
      )}
    </main>
  );
}
