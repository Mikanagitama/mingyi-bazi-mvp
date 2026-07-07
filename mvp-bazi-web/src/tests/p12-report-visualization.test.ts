import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FullReport } from "@/components/FullReport";
import { sampleReportReading } from "@/lib/reports/sample-report";

describe("P1.2 full report visualization", () => {
  it("renders structured Bazi evidence before the prose sections", () => {
    const html = renderToStaticMarkup(
      React.createElement(FullReport, { reading: sampleReportReading, report: sampleReportReading.fullReport! })
    );

    expect(html).toContain("Four Pillars Table");
    expect(html).toContain("Heavenly Stem");
    expect(html).toContain("Earthly Branch");
    expect(html).toContain("Hidden Stems");
    expect(html).toContain("Five Elements Balance");
    expect(html).toContain("Your Day Master");
    expect(html).toContain("Luck Pillar Timeline");
    expect(html).toContain("Current Year / Current 30-Day Energy");
    expect(html).toContain("Core Personality");
    expect(sampleReportReading.fullReport?.sections).toHaveLength(8);
  });
});
