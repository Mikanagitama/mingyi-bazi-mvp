import type { PublicReading } from "@/lib/bazi/types";
import { generateBaziChart } from "@/lib/bazi/chart";
import { generateFreeReport } from "./free-report";

const chart = generateBaziChart({
  name: "Sample Reader",
  birthDate: "1992-08-14",
  birthTime: "09:30",
  birthTimeUnknown: false,
  gender: "female",
  birthPlace: "Singapore",
  timezone: "Asia/Singapore",
  trueSolarTime: true,
  userQuestion: "What should I understand about career, relationships, and timing?",
  language: "en"
});

export const sampleReportReading: PublicReading = {
  id: "sample-report",
  name: "Sample Reader",
  gender: "female",
  birthDate: "1992-08-14",
  birthTime: "09:30",
  birthTimeUnknown: false,
  birthPlace: "Singapore",
  timezone: "Asia/Singapore",
  trueSolarTime: true,
  userQuestion: "What should I understand about career, relationships, and timing?",
  language: "en",
  chart,
  freeReport: generateFreeReport(chart, "en"),
  paymentStatus: "paid",
  createdAt: "2026-07-07T00:00:00.000Z",
  updatedAt: "2026-07-07T00:00:00.000Z",
  fullReport: {
    language: "en",
    headline: "Sample Full Bazi Report",
    sections: [
      {
        title: "Core Personality",
        body: "This sample chart describes a person who tends to observe first, then act with deliberate momentum. The Day Master suggests a reflective style: thoughtful under pressure, more effective when goals are clear, and sensitive to environments that feel chaotic or rushed."
      },
      {
        title: "Five Elements Balance",
        body: "The sample balance shows visible Wood and Earth themes, with Metal and Water adding structure and reflection. In plain language, this can feel like someone who wants growth, stability, and useful feedback, but may need extra rest when decisions become too mentally crowded."
      },
      {
        title: "Career Direction",
        body: "Career energy in this sample favors roles that combine judgment, communication, and steady improvement. Advisory work, product thinking, education, research, operations, or client-facing strategy may feel more natural than work that is purely repetitive."
      },
      {
        title: "Wealth Pattern",
        body: "The sample wealth pattern is framed as planning insight, not a promise. It points toward patient accumulation, clear budgeting, and opportunities that grow from skill, reputation, and timing rather than impulsive risk."
      },
      {
        title: "Love & Relationships",
        body: "Relationship themes in this sample suggest warmth with a need for emotional steadiness. The person may open slowly, but tends to value loyalty, practical support, and communication that is direct without becoming harsh."
      },
      {
        title: "Current 30-Day Energy",
        body: "For the current 30-day sample window, the reading would focus on emotional pacing, work momentum, money caution, and one practical action. A good theme might be: simplify the next decision, finish one visible task, and avoid overcommitting from temporary pressure."
      },
      {
        title: "2026 Yearly Timing",
        body: "The sample yearly timing section highlights possible windows for renewal, responsibility, and relationship recalibration. It avoids absolute predictions and instead explains where the year may ask for better structure, cleaner priorities, and steady follow-through."
      },
      {
        title: "Practical Advice",
        body: "Use this sample report as a map for reflection: notice what feels accurate, what feels aspirational, and what feels like a useful question. A real paid report is generated from the birth details submitted by the reader."
      }
    ],
    disclaimer:
      "This is a sample report. It is not based on your birth details. MINGYI provides cultural interpretation for entertainment and self-reflection, not medical, legal, financial, investment, or professional advice.",
    generation: { mode: "template" }
  }
};
