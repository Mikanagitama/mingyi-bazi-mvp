import Link from "next/link";
import { en } from "@/lib/i18n/en";
import { zh } from "@/lib/i18n/zh";
import { homeHref, langFromSearchParams } from "@/lib/i18n/routing";
import { FULL_REPORT_PRICE_COPY } from "@/lib/product";

export default async function TermsPage({
  searchParams
}: {
  searchParams?: Promise<{ lang?: string | string[] }>;
}) {
  const language = langFromSearchParams(searchParams ? await searchParams : {});
  const copy = language === "zh" ? zh : en;
  return (
    <main className="legalPage">
      <Link href={homeHref(language)}>MINGYI</Link>
      <h1>{copy.legal.terms}</h1>
      {language === "zh" ? (
        <>
          <p>MINGYI 提供数字八字报告，用于娱乐参考、文化解读和自我理解。</p>
          <p>完整八字报告价格为 2.99 美元，一次性付费。购买会解锁你提交出生信息对应的一份完整报告。退款处理请通过网站公开支持邮箱申请。</p>
          <p>你同意不把本服务作为医疗、法律、财务或心理专业建议的替代品。</p>
        </>
      ) : (
        <>
          <p>MINGYI provides a digital Bazi reading for entertainment, cultural interpretation, and self-reflection.</p>
          <p>{FULL_REPORT_PRICE_COPY} The purchase unlocks one full report for the birth information submitted. Refund handling should be requested through the support contact listed on the live site.</p>
          <p>You agree not to use this service as a substitute for professional medical, legal, financial, or psychological advice.</p>
        </>
      )}
    </main>
  );
}
