import type { ReportSection } from "@/lib/bazi/types";

export function LockedSection({ section }: { section: ReportSection }) {
  return (
    <article className="lockedSection">
      <span className="lockIcon">◎</span>
      <div>
        <h3>{section.title}</h3>
        <p>{section.body}</p>
      </div>
    </article>
  );
}
