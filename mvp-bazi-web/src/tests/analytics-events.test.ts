import { beforeEach, describe, expect, it } from "vitest";
import { POST as eventsRoute } from "@/app/api/events/route";
import { readLocalStore, resetLocalStoreForTests } from "@/lib/db/client";

function resetTestEnv() {
  delete process.env.DATABASE_URL;
  process.env.NODE_ENV = "test";
  process.env.MINGYI_LOCAL_STORE_NAME = `analytics-events-${Date.now()}-${Math.random()}.json`;
  resetLocalStoreForTests();
}

describe("launch analytics events", () => {
  beforeEach(() => {
    resetTestEnv();
  });

  it("accepts public funnel events with sanitized metadata", async () => {
    const response = await eventsRoute(
      new Request("https://www.fountersaying.com/api/events", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "homepage_cta_clicked",
          path: "/",
          metadata: {
            href: "/reading/new",
            oversized: "x".repeat(300),
            nested: { report: "not stored" }
          }
        })
      })
    );

    expect(response.status).toBe(200);
    const event = readLocalStore().events[0];
    expect(event.name).toBe("homepage_cta_clicked");
    expect(event.metadata?.href).toBe("/reading/new");
    expect(String(event.metadata?.oversized).length).toBe(160);
    expect(event.metadata).not.toHaveProperty("nested");
  });

  it("rejects unsupported event names", async () => {
    const response = await eventsRoute(
      new Request("https://www.fountersaying.com/api/events", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "full_report_body_dump", path: "/reading/test/full" })
      })
    );

    expect(response.status).toBe(400);
    expect(readLocalStore().events).toHaveLength(0);
  });
});
