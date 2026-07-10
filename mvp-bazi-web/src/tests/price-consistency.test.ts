import { describe, expect, it } from "vitest";
import { metadata, structuredData } from "@/app/layout";
import { en } from "@/lib/i18n/en";
import { zh } from "@/lib/i18n/zh";
import { FULL_REPORT_CTA, FULL_REPORT_PRICE_LABEL, PAYMENT_TRUST_COPY } from "@/lib/product";

const publicCopy = JSON.stringify({ metadata, structuredData, en, zh });

describe("launch price consistency", () => {
  it("uses one official $2.99 USD product price across public copy", () => {
    expect(FULL_REPORT_PRICE_LABEL).toBe("$2.99");
    expect(FULL_REPORT_CTA).toBe("Unlock Full Report — $2.99");
    expect(PAYMENT_TRUST_COPY).toBe("One-time payment. Secure checkout. No recurring charge.");
    expect(en.reading.unlock).toBe(FULL_REPORT_CTA);
    expect(en.reading.secure).toBe(PAYMENT_TRUST_COPY);
    expect(zh.reading.unlock).toContain(FULL_REPORT_PRICE_LABEL);
    expect(JSON.stringify(structuredData)).toContain('"price":"2.99"');
  });

  it("does not show retired JPY launch-test pricing in public copy", () => {
    expect(publicCopy).not.toMatch(/JP¥500|¥500|500 JPY|500 日元|JPY|日元/);
  });
});
