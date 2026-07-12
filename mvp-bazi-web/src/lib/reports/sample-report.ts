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

const zhChart = generateBaziChart({
  name: "样例用户",
  birthDate: "1992-08-14",
  birthTime: "09:30",
  birthTimeUnknown: false,
  gender: "female",
  birthPlace: "Singapore",
  timezone: "Asia/Singapore",
  trueSolarTime: true,
  userQuestion: "我想了解事业、感情和时间节奏。",
  language: "zh"
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

export const sampleReportReadingZh: PublicReading = {
  id: "sample-report",
  name: "样例用户",
  gender: "female",
  birthDate: "1992-08-14",
  birthTime: "09:30",
  birthTimeUnknown: false,
  birthPlace: "Singapore",
  timezone: "Asia/Singapore",
  trueSolarTime: true,
  userQuestion: "我想了解事业、感情和时间节奏。",
  language: "zh",
  chart: zhChart,
  freeReport: generateFreeReport(zhChart, "zh"),
  paymentStatus: "paid",
  createdAt: "2026-07-07T00:00:00.000Z",
  updatedAt: "2026-07-07T00:00:00.000Z",
  fullReport: {
    language: "zh",
    headline: "完整八字报告示例",
    sections: [
      {
        title: "核心性格",
        body: "这个样例命盘展示的是一种先观察、再行动的节奏。日主代表一个人面对压力、机会和关系时的核心方式：思考较深，适合在目标清晰、环境稳定时发挥，遇到混乱或催促时需要先整理节奏。"
      },
      {
        title: "五行平衡",
        body: "样例中的五行呈现出木与土较明显、金水提供结构与反思的倾向。白话来说，这类组合常见于重视成长、稳定和反馈的人，但在信息过多或选择太拥挤时，容易感到精神消耗。"
      },
      {
        title: "事业方向",
        body: "这个样例更适合结合判断、沟通和持续改进的工作。咨询、产品思考、教育、研究、运营、客户策略等方向，会比单纯重复执行更容易形成长期优势。"
      },
      {
        title: "财富模式",
        body: "财富部分只作为规划参考，不承诺结果。样例显示更适合耐心累积、清晰预算，以及从技能、口碑和时机中获得机会，而不是依赖冲动风险。"
      },
      {
        title: "感情关系",
        body: "关系主题偏向温和但需要稳定感。这个样例中的人可能不会很快完全打开自己，但一旦确认信任，会重视忠诚、实际支持，以及直接但不尖锐的沟通。"
      },
      {
        title: "未来30天能量",
        body: "近期样例重点会放在情绪节奏、工作推进、金钱谨慎和一个可执行动作上。适合的提醒是：简化下一个决定，完成一个看得见的任务，不要因为短期压力而过度承诺。"
      },
      {
        title: "2026 年度节奏",
        body: "年度节奏部分会提示更新、责任和关系重新校准的窗口。它不会给绝对预言，而是说明这一年可能在哪些方面要求更好的结构、更清楚的优先级和持续执行。"
      },
      {
        title: "实用建议",
        body: "请把这份样例当作报告格式和解读深度的参考：看看哪些内容让你觉得有启发，哪些地方像是值得继续追问的问题。真实付费报告会根据你提交的出生信息单独生成。"
      }
    ],
    disclaimer:
      "这是一份样例报告，不基于你的出生资料。MINGYI 提供的是文化解读、娱乐参考和自我理解工具，不构成医疗、法律、财务、投资或专业建议。",
    generation: { mode: "template" }
  }
};
