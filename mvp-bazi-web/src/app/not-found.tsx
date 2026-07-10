import Link from "next/link";

export default function NotFound() {
  return (
    <main className="readingPage">
      <section className="reportShell">
        <p className="eyebrow">Not Found</p>
        <h1>Reading not found</h1>
        <p className="disclaimer">
          This reading link is invalid or no longer available. If you already paid and need help, contact
          {" "}support@fountersaying.com.
        </p>
        <Link className="primaryButton" href="/reading/new">Start a New Free Preview</Link>
      </section>
    </main>
  );
}
