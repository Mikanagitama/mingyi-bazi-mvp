import Link from "next/link";
import { LanguageSwitch } from "./LanguageSwitch";
import type { en } from "@/lib/i18n/en";
import type { zh } from "@/lib/i18n/zh";

type Copy = typeof en | typeof zh;

export function LandingPage({ copy }: { copy: Copy }) {
  const readingHref = copy.lang === "zh" ? "/reading/new?lang=zh" : "/reading/new";

  return (
    <main className="site">
      <header className="nav">
        <Link href={copy.lang === "zh" ? "/zh" : "/"} className="brand">
          <span className="brandMark">命</span>
          <span>
            <strong>MINGYI</strong>
            <small>Bazi Destiny</small>
          </span>
        </Link>
        <nav>
          <a href="#how">{copy.nav.how}</a>
          <Link href="/sample-report">{copy.nav.sample}</Link>
          <Link href="/privacy">{copy.nav.privacy}</Link>
          <LanguageSwitch language={copy.lang} />
          <Link className="navCta" href={readingHref}>{copy.nav.cta}</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="heroText">
          <p className="eyebrow">{copy.landing.eyebrow}</p>
          <h1>{copy.landing.title}</h1>
          <p className="subtitle">{copy.landing.subtitle}</p>
          <div className="heroActions">
            <Link className="primaryButton" href={readingHref}>{copy.landing.primary}</Link>
            <Link className="secondaryButton" href="/sample-report">{copy.nav.sample}</Link>
            <span>{copy.landing.trust}</span>
          </div>
        </div>
        <div className="yinYang" aria-hidden="true">
          <span />
        </div>
        <div className="verticalInk" aria-hidden="true">
          <span>知命而行</span>
          <span>顺势而为</span>
        </div>
      </section>

      <section className="proofBand" aria-label="Product strengths">
        {copy.landing.features.map(([title, body]) => (
          <article key={title}>
            <span>准</span>
            <div>
              <h2>{title}</h2>
              <p>{body}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="section" id="sample">
        <p className="eyebrow">{copy.landing.eyebrow}</p>
        <h2>{copy.landing.discoverTitle}</h2>
        <div className="discoverGrid">
          {copy.landing.discover.map(([title, body]) => (
            <article className="tile" key={title}>
              <div className="tileIcon">◇</div>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section steps" id="how">
        <p className="eyebrow">{copy.nav.how}</p>
        <h2>{copy.landing.howTitle}</h2>
        <div className="stepGrid">
          {copy.landing.steps.map(([title, body], index) => (
            <article key={title}>
              <span>{index + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">MINGYI METHOD</p>
        <h2>{copy.landing.methodTitle}</h2>
        <div className="methodGrid">
          {copy.landing.method.map(([title, body]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section futureReports">
        <p className="eyebrow">Coming Soon</p>
        <h2>{copy.landing.futureTitle}</h2>
        <p className="sectionIntro">{copy.landing.futureSub}</p>
        <div className="futureGrid">
          {copy.landing.futureReports.map(([title, body]) => (
            <article key={title}>
              <span>Coming Soon</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="banner">
        <h2>{copy.landing.footerCta}</h2>
        <p>{copy.landing.footerSub}</p>
        <Link className="primaryButton" href={readingHref}>{copy.landing.primary}</Link>
      </section>
    </main>
  );
}
