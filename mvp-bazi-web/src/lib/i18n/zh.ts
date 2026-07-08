export const zh = {
  lang: "zh" as const,
  nav: {
    home: "首页",
    how: "如何使用",
    sample: "报告示例",
    privacy: "隐私",
    cta: "开始解读",
    switch: "English"
  },
  landing: {
    eyebrow: "四柱一命",
    title: "看懂命局，掌握人生节奏。",
    highlight: "命局",
    subtitle: "用更白话的方式解读八字，覆盖性格、事业、感情、年度趋势和幸运指南。",
    primary: "获取免费预览",
    trust: "注重隐私。不收户籍地。不强制出生地。",
    features: [
      ["精准八字盘", "四柱、日主、五行和十神基础结构"],
      ["免费预览", "付费前先看命盘和白话摘要"],
      ["完整报告", "解锁事业、财运、感情、流年和幸运指南"],
      ["中英双语", "默认英文，也可以切换中文阅读"]
    ],
    discoverTitle: "你将看到什么",
    discover: [
      ["核心性格", "你的性格底色和人生主题"],
      ["五行平衡", "木火土金水的整体分布"],
      ["事业方向", "适合的工作方式和职业节奏"],
      ["财富模式", "把金钱节奏作为规划参考"],
      ["感情关系", "亲密关系和人际互动模式"],
      ["未来30天能量", "近期状态、提醒和行动重点"]
    ],
    howTitle: "简单三步",
    steps: [
      ["输入信息", "填写出生日期、时间和可选性别。"],
      ["生成预览", "先查看四柱和免费解读。"],
      ["解锁完整报告", "通过安全支付一次性获取完整内容。"]
    ],
    methodTitle: "为什么 Mingyi 不一样",
    method: [
      ["先排八字结构", "先根据出生信息计算四柱、日主、五行和十神。"],
      ["再用 AI 白话解释", "AI 只负责把结构化命盘解释成更容易理解的内容。"],
      ["支持真太阳时", "识别出生地时，可按经度修正出生时间。"],
      ["保护出生资料", "你的资料只用于生成本次报告。"],
      ["安全支付", "付款由安全支付服务商处理。"],
      ["一次性付费", "完整报告不是订阅制，不会重复扣费。"]
    ],
    futureTitle: "未来专题报告",
    futureSub: "未来可能加入的细分报告，不影响当前完整八字报告的一次性购买流程。",
    futureReports: [
      ["财富模式报告", "理解你的命盘与金钱、机会和长期赚钱风格之间的关系。"],
      ["感情关系报告", "探索你的关系模式、吸引方式和情感需求。"]
    ] as Array<[string, string]>,
    footerCta: "命运在你手中。",
    footerSub: "现在开始了解它。"
  },
  form: {
    title: "开始免费八字预览",
    name: "显示名称",
    namePlaceholder: "可选",
    birthDate: "出生日期",
    birthTime: "出生时间",
    unknownTime: "我不知道准确出生时间",
    gender: "性别",
    genderOptional: "可选",
    female: "女",
    male: "男",
    other: "不透露",
    birthPlace: "出生地",
    birthPlacePlaceholder: "可选，例如 London / Tokyo / Shanghai",
    timezone: "时区",
    timezoneAuto: "使用出生地当地时间 / 不确定",
    trueSolarTime: "可用时启用真太阳时",
    trueSolarTimeHelp: "真太阳时会根据出生地经度修正出生时间。出生地可识别时，可能更贴近传统八字排盘习惯。",
    unknownTimeHelp: "不知道准确出生时间也可以继续，但与时柱相关的细节会减少。",
    userQuestion: "想重点看的问题",
    userQuestionPlaceholder: "例如：今年事业上应该注意什么？",
    language: "报告语言",
    submit: "生成免费预览",
    note: "你的出生资料只用于生成报告。本产品不收集户籍地，出生地可选。"
  },
  reading: {
    freeTitle: "你的免费八字预览",
    fullTitle: "你的完整八字解读",
    pillars: "四柱",
    dayMaster: "日主",
    elements: "五行",
    accuracy: "准确度说明",
    lockedTitle: "解锁完整报告",
    lockedText: "事业、财运、感情、未来30天能量、年度节奏和实用建议将在付费后开放。",
    unlock: "解锁完整报告 — 500 日元",
    secure: "一次性付费。安全支付。即时数字访问。不会重复扣费。",
    trustBullets: ["一次性付费", "安全支付", "即时数字访问", "不会重复扣费"],
    privacyReassurance: "你的出生资料只用于生成报告。我们不会出售你的个人信息。",
    refundReassurance: "如果你已付款但无法访问报告，请联系支持，我们会帮助恢复或退款。",
    paid: "支付已确认",
    copy: "复制报告",
    print: "打印 / 保存 PDF",
    notFound: "未找到报告"
  },
  legal: {
    privacy: "隐私政策",
    terms: "服务条款",
    refund: "退款政策",
    disclaimer: "免责声明",
    methodology: "方法说明",
    body: "MINGYI 提供的是文化解读、娱乐参考和自我理解工具，不构成医疗、法律、财务或心理建议，也不保证任何具体结果。"
  },
  footer: {
    links: [
      ["隐私政策", "/privacy"],
      ["服务条款", "/terms"],
      ["退款政策", "/refund"],
      ["免责声明", "/disclaimer"],
      ["方法说明", "/methodology"],
      ["联系支持", "/contact"]
    ] as Array<[string, string]>
  }
};
