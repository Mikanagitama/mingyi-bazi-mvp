import Link from "next/link";
import { en } from "@/lib/i18n/en";
import { zh } from "@/lib/i18n/zh";
import { homeHref, langFromSearchParams } from "@/lib/i18n/routing";

export default async function PrivacyPage({
  searchParams
}: {
  searchParams?: Promise<{ lang?: string | string[] }>;
}) {
  const language = langFromSearchParams(searchParams ? await searchParams : {});
  const copy = language === "zh" ? zh : en;
  return (
    <main className="legalPage">
      <Link href={homeHref(language)}>MINGYI</Link>
      <h1>{copy.legal.privacy}</h1>
      {language === "zh" ? (
        <>
          <p>我们只收集生成八字报告所需的出生信息、可选显示名称、可选出生地、可选问题、付款后的邮箱和支付状态。</p>
          <p>我们不收集户籍地。出生地是可选项，只用于计算参考。银行卡信息由安全支付服务商处理，本网站不保存。</p>
          <p>你可以联系支持邮箱，申请删除报告、退款审核或咨询数据问题。</p>
        </>
      ) : (
        <>
          <p>We collect only the birth details needed to create your Bazi reading, optional display name, optional birthplace, optional question, optional email from payment, and payment status from our payment provider.</p>
          <p>We do not collect hukou. Birthplace is optional and used only as calculation context. Payment card details are handled by the secure checkout provider and are not stored on this site.</p>
          <p>You may contact support to request report deletion, refund review, or data questions.</p>
        </>
      )}
    </main>
  );
}
