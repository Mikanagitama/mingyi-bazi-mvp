import Link from "next/link";
import { en } from "@/lib/i18n/en";
import { zh } from "@/lib/i18n/zh";
import { homeHref, langFromSearchParams } from "@/lib/i18n/routing";

export default async function RefundPage({
  searchParams
}: {
  searchParams?: Promise<{ lang?: string | string[] }>;
}) {
  const language = langFromSearchParams(searchParams ? await searchParams : {});
  const copy = language === "zh" ? zh : en;
  return (
    <main className="legalPage">
      <Link href={homeHref(language)}>MINGYI</Link>
      <h1>{copy.legal.refund}</h1>
      {language === "zh" ? (
        <>
          <p>每次购买会解锁一份基于你提交出生信息生成的数字八字报告。</p>
          <p>如果付款成功但报告没有解锁，请带上付款邮箱和报告链接联系支持，我们会帮助恢复访问或审核退款。</p>
          <p>由于报告是数字生成和交付，重复付款、技术故障或误购会按具体情况审核退款。</p>
        </>
      ) : (
        <>
          <p>Each purchase unlocks one digital Bazi report for the birth information submitted at checkout.</p>
          <p>If payment succeeds but the report does not unlock, contact support with your checkout email and reading link so we can restore access or review a refund.</p>
          <p>Because the report is generated and delivered digitally, refunds are reviewed case by case for duplicate payments, technical failures, or accidental purchases.</p>
        </>
      )}
    </main>
  );
}
