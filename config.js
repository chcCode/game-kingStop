// ===== 地图预设 =====
const MAP_CONFIGS = {
  hulao: {
    id: "hulao",
    name: "虎牢关",
    description: "9x7 标准战场，攻守节奏均衡",
    cols: 9,
    rows: 7,
    hexSize: 36,
    initialLayout: {
      playerCity: { q: 0, r: 6 },
      playerTerritory: [{ q: 1, r: 6 }, { q: 0, r: 5 }],
      enemyCity: { q: 8, r: 0 },
      enemyTerritory: [{ q: 7, r: 0 }, { q: 8, r: 1 }],
    },
    colors: {
      unknownFill: 0x292c2a,
      unknownLine: 0x555957,
      neutralFill: 0x55514a,
      neutralLine: 0x8f897d,
      playerFill: 0x245f49,
      playerLine: 0x68d4a4,
      enemyFill: 0x70352f,
      enemyLine: 0xe36c5e,
      captureLine: 0xf7d65c,
    },
    viewport: {
      padding: 10,
      reservedTop: 80,
      reservedBottom: 80,
      minHeight: 180,
      maxScale: 1.35,
    },
  },
  chibi: {
    id: "chibi",
    name: "赤壁水寨",
    description: "11x7 狭长战场，探索路线更丰富",
    cols: 11,
    rows: 7,
    hexSize: 32,
    initialLayout: {
      playerCity: { q: 0, r: 6 },
      playerTerritory: [{ q: 1, r: 6 }, { q: 0, r: 5 }],
      enemyCity: { q: 10, r: 0 },
      enemyTerritory: [{ q: 9, r: 0 }, { q: 10, r: 1 }],
    },
    colors: {
      unknownFill: 0x26323a,
      unknownLine: 0x4f6874,
      neutralFill: 0x52636a,
      neutralLine: 0x91a5aa,
      playerFill: 0x235e68,
      playerLine: 0x69d4dc,
      enemyFill: 0x74402f,
      enemyLine: 0xee8764,
      captureLine: 0xffd166,
    },
    viewport: {
      padding: 10,
      reservedTop: 80,
      reservedBottom: 80,
      minHeight: 180,
      maxScale: 1.3,
    },
  },
};

// ===== 游戏配置 CONFIG =====
const CONFIG = {
  defaultMap: "hulao",
  maps: MAP_CONFIGS,
  map: MAP_CONFIGS.hulao,
  economy: { startGold: 100, baseIncome: 2, goldCap: 9999, mineIncome: 5 },
  reveal: { normalCost: 25, advancedCostReserved: 250, goldReward: 50 },
  revealRates: {
    normal: {
      empty: 0.45,
      gold_mine: 0.15,
      random_barracks: 0.15,
      tower_arrow: 0.10,
      tower_cannon: 0.05,
      general_camp: 0.05,
      gold_reward: 0.05,
    },
  },
  battle: {
    prepareTime: 3,
    duration: 180,
    captureTime: 2,
    captureRadius: 0.35,
    maxUnitsPerSide: 80,
  },
  buildings: {
    gold_mine: { name: "金矿", cost: 50, hp: 200, income: 5 },
    barracks_spear: { name: "枪兵营", cost: 80, hp: 300, spawnInterval: 3, unitType: "spear" },
    barracks_cavalry: { name: "骑兵营", cost: 80, hp: 300, spawnInterval: 3, unitType: "cavalry" },
    barracks_shield: { name: "盾兵营", cost: 80, hp: 300, spawnInterval: 3, unitType: "shield" },
    barracks_archer: { name: "弓兵营", cost: 80, hp: 300, spawnInterval: 3, unitType: "archer" },
    tower_arrow: { name: "箭塔", cost: 60, hp: 250, atk: 15, range: 2, atkInterval: 1 },
    tower_cannon: { name: "霹雳塔", cost: 120, hp: 250, atk: 30, range: 2.5, atkInterval: 2, aoeRadius: 1 },
    general_camp: { name: "武将据点", cost: null, hp: 300 },
    main_city: { name: "主城", cost: null, hp: 1000 },
  },
  units: {
    spear: { name: "枪兵", hp: 80, atk: 12, speed: 1.5, atkInterval: 1, range: 0.6, counters: "cavalry", color: 0xf39c45 },
    cavalry: { name: "骑兵", hp: 70, atk: 15, speed: 2.5, atkInterval: 1.2, range: 0.6, counters: "shield", color: 0x9b653f },
    shield: { name: "盾兵", hp: 150, atk: 8, speed: 1, atkInterval: 1.5, range: 0.6, counters: "archer", color: 0x4e8fc9 },
    archer: { name: "弓兵", hp: 60, atk: 14, speed: 1.5, atkInterval: 1, range: 2, counters: "spear", color: 0x65ad65 },
  },
  general: {
    guanYu: {
      name: "关羽",
      hp: 240,
      atk: 36,
      speed: 1.5,
      atkInterval: 1,
      range: 0.6,
      reviveTime: 15,
      skill: { name: "青龙偃月", damage: 50, range: 1.5, cooldown: 5 },
    },
  },
  ai: {
    decisionInterval: 2,
    maxMines: 2,
    maxBarracks: 3,
    maxArrowTowers: 2,
    emergencyCityRange: 3,
  },
};

const SIDES = ["player", "enemy"];
const BARRACKS = ["barracks_spear", "barracks_cavalry", "barracks_shield", "barracks_archer"];
const BUILDABLE = ["gold_mine", ...BARRACKS, "tower_arrow", "tower_cannon"];
