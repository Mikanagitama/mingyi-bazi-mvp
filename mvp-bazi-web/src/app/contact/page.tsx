import Link from "next/link";
import { homeHref, langFromSearchParams } from "@/lib/i18n/routing";

export default async function ContactPage({
  searchParams
}: {
  searchParams?: Promise<{ lang?: string | string[] }>;
}) {
  const language = langFromSearchParams(searchParams ? await searchParams : {});
  return (
    <main className="legalPage">
      <Link href={homeHref(language)}>MINGYI</Link>
      <h1>{language === "zh" ? "联系支持" : "Contact"}</h1>
      {language === "zh" ? (
        <>
          <p>付款访问问题、删除请求、退款审核或数据问题，请联系 support@fountersaying.com。</p>
          <p>如果你已付款但无法访问报告，请附上付款邮箱和报告链接，我们会帮助恢复访问或审核退款。</p>
        </>
      ) : (
        <>
          <p>For payment access issues, deletion requests, refund review, or data questions, contact support@fountersaying.com.</p>
          <p>If you paid but cannot access your report, include your checkout email and reading link so we can help restore access or review a refund.</p>
        </>
      )}
    </main>
  );
}
