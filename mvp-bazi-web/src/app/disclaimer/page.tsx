import Link from "next/link";
import { en } from "@/lib/i18n/en";
import { zh } from "@/lib/i18n/zh";
import { homeHref, langFromSearchParams } from "@/lib/i18n/routing";

export default async function DisclaimerPage({
  searchParams
}: {
  searchParams?: Promise<{ lang?: string | string[] }>;
}) {
  const language = langFromSearchParams(searchParams ? await searchParams : {});
  const copy = language === "zh" ? zh : en;
  return (
    <main className="legalPage">
      <Link href={homeHref(language)}>MINGYI</Link>
      <h1>{copy.legal.disclaimer}</h1>
      <p>{copy.legal.body}</p>
      {language === "zh" ? (
        <>
          <p>八字解读描述的是象征性倾向和时间节奏，不应被当作确定命运，也不保证财富、健康、感情或成功结果。</p>
          <p>如果你正在做重要人生决定，请咨询合格专业人士，并只把本报告作为一个自我反思参考。</p>
        </>
      ) : (
        <>
          <p>Bazi interpretation describes symbolic tendencies and timing patterns. It should not be treated as certainty, fate, or a guarantee of wealth, health, love, or success.</p>
          <p>If you are making important life decisions, consult qualified professionals and use this report only as one reflective input.</p>
        </>
      )}
    </main>
  );
}
