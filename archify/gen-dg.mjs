// 生成全部航图各航段的 archify workflow 决策图规范
import { writeFileSync } from "node:fs";

const estW = (t) => {
  let w = 0;
  for (const ch of String(t).replace(/<[^>]+>/g, "")) w += /[⺀-鿿＀-￯①-⑩·—]/.test(ch) ? 13 : 7;
  return Math.max(110, Math.ceil(w + 34));
};
const sized = (n) => ({ ...n, width: Math.max(estW(n.label), n.sublabel ? Math.ceil(estW(n.sublabel) * 0.82) : 0) });

const CHARTS = [
  {
    key: "c1", chartId: "D574-1", eff: "2026-04-21", oxy: "22分钟及以上氧气系统",
    segs: [
      { seq: 1, name: "OKTAT–BEKIR", alt: "25000FT", opts: [
        { label: "直飞 UBBB / UBBQ", sub: "保持 25000FT 去备降", type: "cloud" } ]},
      { seq: 2, name: "BEKIR–BADIR", alt: "25000FT", opts: [
        { label: "直飞 UBBG / UBBQ", sub: "保持 25000FT 去备降", type: "cloud" },
        { label: "沿航路过 ADEKI 以西", sub: "降 13000FT · 沿航路备降 UGTB", type: "external" } ]},
      { seq: 3, name: "BADIR–LAGAS", alt: "25000FT", opts: [
        { label: "直飞 UBBG", sub: "保持 25000FT 去备降", type: "cloud" },
        { label: "直飞 UBBG · 沿航路 UBBQ", sub: "保持 25000FT 去备降", type: "cloud" },
        { label: "向北偏航 → UGTB", sub: "保持 25000FT 去备降", type: "external" } ]},
      { seq: 4, name: "LAGAS–NOLGA", alt: "25000FT", opts: [
        { label: "直飞 LTCF / LTCT", sub: "保持 25000FT 去备降", type: "cloud" },
        { label: "回 LAGAS → 直飞 UBBG", sub: "过 LAGAS 后降 13000FT", type: "external" },
        { label: "回 LAGAS → UGTB", sub: "过 LAGAS 后降 13000FT", type: "external" } ]},
      { seq: 5, name: "NOLGA–GONPU", alt: "25000FT", opts: [
        { label: "直飞 LTCF / LTCT", sub: "保持 25000FT 去备降", type: "cloud" },
        { label: "至 GONPU → 直飞 LTCE", sub: "保持 25000FT 去备降", type: "cloud" },
        { label: "经 GONPU–TBN 降 10000FT", sub: "备降 LTCG / LTCB / LTFH", type: "external" },
        { label: "回 LAGAS 降 13000FT", sub: "备降 UGTB", type: "external" } ]},
      { seq: 6, name: "GONPU–TBN", alt: "25000FT", opts: [
        { label: "直飞 LTCD / LTCE", sub: "保持 25000FT 去备降", type: "cloud" },
        { label: "至 TBN → 降 10000FT", sub: "备降 LTCG / LTCB / LTFH", type: "external" } ]},
    ],
  },
  {
    key: "c2", chartId: "D574-2", eff: "2026-04-21", oxy: "22分钟及以上氧气系统",
    segs: [
      { seq: 1, name: "D130–ODILI", alt: "25000FT", opts: [
        { label: "至 ODILI → 直飞 LTCF / LTCT", sub: "保持 25000FT 去备降", type: "cloud" },
        { label: "至 ODILI → 过 LTCF 降 13000", sub: "直飞 LTCE 备降", type: "cloud" },
        { label: "至 LAGAS 降 13000FT", sub: "备降 UGTB", type: "external" },
        { label: "至 D130 降 10000FT", sub: "沿航路 LTCG / LTCB / LTFH", type: "external" } ]},
      { seq: 2, name: "ODILI–LAGAS", alt: "25000FT", opts: [
        { label: "直飞 LTCF(或→LTCE)", sub: "过 LTCF 后降 13000FT 直飞 LTCE", type: "cloud" },
        { label: "直飞 LTCT(或→UBBG)", sub: "过 LTCT 后降 14000FT(红字)直飞 UBBG", type: "cloud", warn: true },
        { label: "至 LAGAS 降 13000FT", sub: "备降 UGTB", type: "external" },
        { label: "回 D130 降 10000FT", sub: "沿航路 LTCG / LTCB / LTFH", type: "external" } ]},
      { seq: 3, name: "LAGAS–SUBUT", alt: "25000FT", opts: [
        { label: "直飞 UBBG", sub: "保持 25000FT 去备降", type: "cloud" },
        { label: "直飞 UBBG · 沿航路 UBBQ", sub: "保持 25000FT 去备降", type: "cloud" },
        { label: "降 13000 · 沿 M747/LAGAS", sub: "备降 UGTB", type: "external" } ]},
      { seq: 4, name: "SUBUT–LEYLA", alt: "25000FT", opts: [
        { label: "直飞 UBBG / UBBQ", sub: "保持 25000FT 去备降", type: "cloud" } ]},
      { seq: 5, name: "LEYLA–OKTAT", alt: "25000FT", opts: [
        { label: "直飞 UBBB / UBBQ", sub: "保持 25000FT 去备降", type: "cloud" } ]},
      { seq: 6, name: "LEYLA–KONUL", alt: "25000FT", opts: [
        { label: "直飞 UBBB / UBBQ", sub: "保持 25000FT 去备降", type: "cloud" } ]},
    ],
  },
  {
    key: "c3", chartId: "D501", eff: "2026-01-28", oxy: "AB · 12分钟氧气系统",
    segs: [
      { seq: 1, name: "DARNO–KZL", alt: "13000FT", opts: [
        { label: "经 KZL–TR–D70T 以西降 10000", sub: "备降 UNAA / UNNT", type: "cloud" },
        { label: "经 MIKET·NEBOK·BD → UIII", sub: "过 D70T 以西降 10000FT", type: "external" },
        { label: "经 MIKET·ROGMA → UNKL", sub: "过 D70T 以西降 10000FT", type: "external" } ]},
      { seq: 2, name: "KZL–LOBIR", alt: "13000FT", opts: [
        { label: "至 LOBIR 降 10000", sub: "沿航路备降 UNAA / UNNT", type: "cloud" },
        { label: "ABK·MIKET·NEBOK·BD", sub: "过LOBIR降10000 → UIII", type: "external" },
        { label: "ABK·MIKET·ROGMA", sub: "过LOBIR降10000 → UNKL", type: "external" } ]},
      { seq: 3, name: "DARNO–TR–D70T", alt: "13000FT", opts: [
        { label: "过 D70T 以西降 10000", sub: "备降 UNAA / UNNT", type: "cloud" },
        { label: "经 MIKET·NEBOK·BD → UIII", sub: "过 D70T 以西降 10000FT", type: "external" },
        { label: "经 MIKET·ROGMA → UNKL", sub: "过 D70T 以西降 10000FT", type: "external" } ]},
      { seq: 4, name: "TOVMO–GINOM", alt: "14000FT", warnAlt: "原图红字", opts: [
        { label: "至 TOVMO 降 10000 → ZMCK", sub: "备降乌兰巴托", type: "cloud" },
        { label: "至 TOVMO 降 10000 · 经 BD", sub: "备降 UIII", type: "cloud" },
        { label: "经 BD·NEBOK·MIKET → UNKL", sub: "沿航路去备降", type: "external" } ]},
      { seq: 5, name: "GINOM–TR", alt: "13000FT", opts: [
        { label: "经 TR–D70T 降 10000", sub: "备降 UNAA / UNNT", type: "cloud" },
        { label: "经 ABK·MIKET → UNKL", sub: "过 D70T 降 10000FT", type: "external" },
        { label: "经 ABK·MIKET·NEBOK·BD → UIII", sub: "过 D70T 降 10000FT", type: "external" } ]},
      { seq: 6, name: "TR–DEKAN", alt: "13000FT", opts: [
        { label: "经 TR–D70T 降 10000", sub: "备降 UNAA / UNNT", type: "cloud" },
        { label: "经 ABK·MIKET → UNKL", sub: "过 D70T 降 10000FT", type: "external" },
        { label: "经 ABK·MIKET·NEBOK·BD → UIII", sub: "过 D70T 降 10000FT", type: "external" } ]},
      { seq: 7, name: "MATAK–ABUSA", alt: "13000FT", opts: [
        { label: "沿 R229 至 MATAK 降 10000", sub: "备降 ZMCK", type: "cloud" },
        { label: "经 MATAK 至 BD 降 10000", sub: "备降 UIII", type: "cloud" },
        { label: "经 BD·NEBOK·MIKET → UNKL", sub: "沿航路去备降", type: "external" } ]},
      { seq: 8, name: "KESUM–ABUSA", alt: "13000FT", warnAlt: "直飞NEBOK后降10000", opts: [
        { label: "经 NEBOK·BD → UIII", sub: "NEBOK 后降 10000FT", type: "cloud" },
        { label: "经 LETBI·TOVMO → ZMCK", sub: "NEBOK 后降 10000FT", type: "cloud" },
        { label: "经 MIKET → UNAA / UNNT", sub: "NEBOK 后降 10000FT", type: "external" } ]},
      { seq: 9, name: "KESUM–IVRAS", alt: "13000FT", opts: [
        { label: "至 IVRAS 降 10000 · 经 MIKET", sub: "备降 UNAA / UNNT", type: "cloud" },
        { label: "经 MIKET·NEBOK·BD → UIII", sub: "至 IVRAS 降 10000FT", type: "external" },
        { label: "经 MIKET → UNKL", sub: "至 IVRAS 降 10000FT", type: "external" } ]},
      { seq: 10, name: "D208G–GINOM", alt: "13000FT", opts: [
        { label: "过 D208G 降 10000 · 返回", sub: "备降 UNAA / UNNT", type: "cloud" },
        { label: "过 D208G 降 10000 → UNKL", sub: "沿航路前往备降", type: "external" },
        { label: "经 MIKET·NEBOK·BD → UIII", sub: "过 D208G 降 10000FT", type: "external" } ]},
    ],
  },
  {
    key: "c4", chartId: "D527-1", eff: "2026-01-28", oxy: "氧气系统适用性见原图",
    segs: [
      { seq: 1, name: "NONAR–SERNA", alt: "13000FT", opts: [
        { label: "北至SERNA / 南至NONAR 降 10000", sub: "沿黑/蓝航路备降 ZMCK", type: "cloud" },
        { label: "南至 NONAR 降 10000", sub: "沿黑/蓝航路备降 ZBAA", type: "cloud" } ]},
      { seq: 2, name: "SERNA–BD", alt: "10000FT", warnAlt: "本段直接降10000", opts: [
        { label: "沿 R497 至 SERNA", sub: "沿黑色航路备降 ZMCK", type: "cloud" },
        { label: "沿 R497 至 BD 台 → UIII", sub: "沿蓝色航路备降", type: "cloud" },
        { label: "至 BD 台 → UNAA / UNNT", sub: "需检查油量", type: "external", warn: true },
        { label: "至 BD 台 → UNKL", sub: "需检查油量", type: "external", warn: true } ]},
      { seq: 3, name: "BD–BUMER", alt: "13000FT", warnAlt: "至BD台后降10000", opts: [
        { label: "沿蓝色航路 → UIII", sub: "BD 台后降 10000FT", type: "cloud" },
        { label: "沿蓝色航路 → UNAA / UNNT", sub: "需检查油量", type: "external", warn: true },
        { label: "沿蓝色航路 → UNKL", sub: "需检查油量", type: "external", warn: true } ]},
      { seq: 4, name: "BUMER–RO", alt: "13000FT", opts: [
        { label: "至 LONKA 降 10000 → UIII", sub: "沿蓝色航路备降", type: "cloud" },
        { label: "至 LONKA 降 10000", sub: "沿蓝色航路备降 UNAA / UNNT", type: "cloud" },
        { label: "至 RO 降 10000 → UNKL", sub: "沿蓝色航路备降", type: "external" } ]},
    ],
  },
];

const CIRCLED = "①②③④⑤⑥⑦⑧⑨⑩";

for (const c of CHARTS) {
  for (const s of c.segs) {
    const circ = CIRCLED[s.seq - 1];
    const optLanes = s.opts.map((o, i) => ({
      id: `opt${i + 1}`,
      label: `方案${CIRCLED[i]}`,
      ...(o.warn ? { variant: "exception" } : {}),
    }));
    const optNodes = s.opts.map((o, i) => ({
      id: `o${i + 1}`,
      lane: `opt${i + 1}`,
      col: 4,
      type: o.type,
      label: o.label,
      sublabel: o.sub,
      ...(o.warn ? { tag: "红字高度" } : {}),
    }));
    const spec = {
      schema_version: 2,
      diagram_type: "workflow",
      meta: {
        title: `${c.chartId} ${circ} ${s.name} 释压决策`,
        locale: "zh-CN",
        animation: "trace",
        quality_profile: "showcase",
      },
      lanes: [
        { id: "event", label: "释压事件" },
        { id: "now", label: "立即处置(同时完成)" },
        ...optLanes,
      ],
      mainPath: ["decomp", "memo", "descend", "decide", "o1", "land"],
      nodes: [
        { id: "decomp", lane: "event", col: 0, type: "security", label: "座舱释压", sublabel: `航段 ${s.name}` },
        { id: "memo", lane: "now", col: 1, type: "backend", label: "氧气面罩 · 建立联系", sublabel: "记忆项目" },
        { id: "descend", lane: "now", col: 2, type: "security", label: `应急下降 ${s.alt}`, sublabel: "Vmo/Mmo · 7700 · MAYDAY", ...(s.warnAlt ? { tag: s.warnAlt } : {}) },
        { id: "decide", lane: "now", col: 3, type: "frontend", label: "评估位置 / 油量 / 天气", sublabel: "选择方案" },
        ...optNodes,
        { id: "land", lane: "opt1", col: 5, type: "database", label: "落地备降场", sublabel: "完成检查单" },
      ].map(sized),
      edges: [
        { from: "decomp", to: "memo", variant: "emphasis", label: "立即" },
        { from: "memo", to: "descend", variant: "emphasis", label: "同时" },
        { from: "descend", to: "decide", variant: "emphasis" },
        ...s.opts.map((o, i) => ({
          from: "decide",
          to: `o${i + 1}`,
          ...(i === 0 ? { variant: "emphasis", label: "优先" } : { role: "branch" }),
        })),
        ...s.opts.map((o, i) => ({
          from: `o${i + 1}`,
          to: "land",
          ...(i === 0 ? { variant: "emphasis" } : { role: "branch" }),
        })),
      ],
      cards: [
        { dot: "rose", title: "高度要点", items: [
          `本航段初始应急下降高度 ${s.alt}(Vmo/Mmo)${s.warnAlt ? " · " + s.warnAlt : ""}`,
          ...s.opts.filter(o => /1[034]000/.test(o.sub + o.label)).slice(0, 3).map(o => `${o.label}:${o.sub}`),
        ]},
        { dot: "amber", title: "使用限制", items: [
          `适用:${c.oxy}`,
          "仅供参考学习,以公司现行有效版本为准",
          `原图 ${c.chartId} · EFF ${c.eff} · ${circ} 号航段`,
        ]},
      ],
    };
    // 已验证的布局修正:c3 ⑤⑥ 的落地节点放中间泳道,避免走廊冲突
    if (c.key === "c3" && [5, 6].includes(s.seq)) {
      spec.nodes.find(n => n.id === "land").lane = "opt2";
    }
    const p = `spec-${c.key}-s${s.seq}.json`;
    writeFileSync(new URL(p, import.meta.url), JSON.stringify(spec, null, 2));
    console.log("wrote", p);
  }
}
