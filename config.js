// ===== 游戏配置 CONFIG =====
const CONFIG = {
  map: { cols: 9, rows: 7, hexSize: 36 },
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

const INITIAL_LAYOUT = {
  playerCity: { q: 0, r: 6 },
  playerTerritory: [{ q: 1, r: 6 }, { q: 0, r: 5 }],
  enemyCity: { q: 8, r: 0 },
  enemyTerritory: [{ q: 7, r: 0 }, { q: 8, r: 1 }],
};

const SIDES = ["player", "enemy"];
const BARRACKS = ["barracks_spear", "barracks_cavalry", "barracks_shield", "barracks_archer"];
const BUILDABLE = ["gold_mine", ...BARRACKS, "tower_arrow", "tower_cannon"];
