export type Language = "en" | "zh";

export type Gender = "female" | "male" | "unspecified";

export type BirthInput = {
  name?: string;
  gender?: Gender;
  birthDate: string;
  birthTime?: string;
  birthTimeUnknown: boolean;
  birthPlace?: string;
  timezone?: string;
  trueSolarTime?: boolean;
  userQuestion?: string;
  language: Language;
};

export type PillarName = "year" | "month" | "day" | "hour";

export type Pillar = {
  name: PillarName;
  stem: string;
  branch: string;
  label: string;
  element: string;
  yinYang: "yin" | "yang";
};

export type ElementBalance = {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
};

export type BaziChart = {
  input: BirthInput;
  solarDateTime: string;
  pillars: Pillar[];
  dayMaster: {
    stem: string;
    element: string;
    yinYang: "yin" | "yang";
    label: string;
  };
  elements: ElementBalance;
  tenGods: Array<{
    pillar: PillarName;
    stemRelation: string;
    branchRelation: string;
  }>;
  day_master: BaziChart["dayMaster"];
  five_elements: ElementBalance;
  ten_gods: Array<{
    pillar: PillarName;
    stem: string;
    hidden_stems: string[];
  }>;
  hidden_stems: Record<PillarName, string[]>;
  nayin: Record<PillarName, string>;
  luck_pillars: Array<{
    index: number;
    start_year: number;
    end_year: number;
    start_age: number;
    end_age: number;
    gan_zhi: string;
  }>;
  annual_transits: Array<{
    year: number;
    pillar: string;
    relation_to_day_master: string;
    branch_interactions: string[];
  }>;
  branch_interactions: Array<{
    type: string;
    branches: string[];
    description: string;
  }>;
  calculation_policy: {
    engine: string;
    calendar: string;
    timezone: string;
    birth_place?: string;
    true_solar_time_requested: boolean;
    true_solar_time_applied: boolean;
    unknown_birth_time: boolean;
    notes: string[];
  };
  accuracyNote: string;
};

export type ReportSection = {
  title: string;
  body: string;
};

export type FreeReport = {
  language: Language;
  headline: string;
  summary: string;
  sections: ReportSection[];
  lockedSections: ReportSection[];
};

export type FullReport = {
  language: Language;
  headline: string;
  sections: ReportSection[];
  disclaimer: string;
};

export type PaymentStatus = "free" | "paid";

export type ReadingRecord = {
  id: string;
  name?: string;
  gender?: Gender;
  birthDate: string;
  birthTime?: string;
  birthTimeUnknown: boolean;
  birthPlace?: string;
  timezone?: string;
  trueSolarTime?: boolean;
  userQuestion?: string;
  language: Language;
  chart: BaziChart;
  freeReport: FreeReport;
  fullReport?: FullReport;
  paymentStatus: PaymentStatus;
  email?: string;
  createdAt: string;
  updatedAt: string;
};

export type PublicReading = Omit<ReadingRecord, "fullReport"> & {
  fullReport?: FullReport;
};
