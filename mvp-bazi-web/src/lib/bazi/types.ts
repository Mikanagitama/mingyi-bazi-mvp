export type Language = "en" | "zh";

export type Gender = "female" | "male" | "unspecified";

export type BirthInput = {
  name?: string;
  gender?: Gender;
  birthDate: string;
  birthTime?: string;
  birthTimeUnknown: boolean;
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
