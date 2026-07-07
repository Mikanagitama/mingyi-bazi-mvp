import type { BaziChart, Language, ReportSection } from "../bazi/types";

function currentTransit(chart: BaziChart) {
  return chart.annual_transits.find((transit) => transit.year === 2026) || chart.annual_transits[0];
}

export function currentEnergySection(chart: BaziChart, language: Language): ReportSection {
  const transit = currentTransit(chart);
  if (language === "zh") {
    return {
      title: "未来30天能量",
      body: `未来30天可以作为短期节奏观察：情绪能量上，先减少同时处理的压力源；事业/工作动能上，适合推进一个能被看见的小成果；金钱机会更适合来自计划、复盘和稳健沟通，而不是冲动冒险；关系氛围需要更清楚地表达边界和期待。适合推进的是已经有基础的任务，适合避免的是为了缓解焦虑而临时加码。若要观察强弱日，可把${transit?.pillar || "当前流年"}相关的日子当作提醒：状态强时推进沟通和交付，状态弱时整理、休息和做选择。一个实用建议：本周只选一个关键动作，坚持完成。`
    };
  }

  return {
    title: "Current 30-Day Energy",
    body: `For the next 30 days, read this as a short-term timing lens. Your current emotional energy may be steadier when you reduce competing priorities and name what actually needs structure. For career/work momentum, push one visible task forward instead of scattering effort across too many fronts. For money opportunities, treat them as planning signals: review, compare, and negotiate calmly rather than chasing pressure. The relationship atmosphere benefits from direct expectations and a slower response rhythm. In plain terms, what to push forward is one already-started commitment; what to avoid is adding new obligations just to relieve anxiety. If you track stronger/weaker days, use the ${transit?.pillar || "current annual"} timing as a reflection cue: stronger days for communication and delivery, weaker days for recovery and editing. One practical suggestion: choose one weekly anchor action and finish it before expanding the plan.`
  };
}
