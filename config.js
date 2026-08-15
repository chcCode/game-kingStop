/**
 * ===== 配置字段说明 =====
 *
 * 地图预设 MapConfig
 * - id: 地图唯一标识，必须与 MAP_CONFIGS 中的键一致。
 * - name / description: 地图选择菜单显示的名称和简介。
 * - shape: 地图轮廓生成方式。
 *   - axialParallelogram: q=0..cols-1、r=0..rows-1 的斜向平行四边形。
 *   - offsetRectangle: 先生成 cols x rows 的偏移网格，再转换为轴向坐标，视觉轮廓接近长方形。
 * - cols / rows: 地图列数和行数；最终地块数等于 cols * rows。
 * - hexSize: 平顶六边形外接圆半径，单位为 CSS 像素。
 * - initialLayout: 双方主城和初始领地的轴向坐标；所有坐标必须位于有效地块内且不能重复。
 * - colors: PixiJS 使用的 0xRRGGBB 数字颜色。
 *   - unknownFill / unknownLine: 未探索地块填充色和边线色。
 *   - neutralFill / neutralLine: 中立地块填充色和边线色。
 *   - playerFill / playerLine: 玩家地块填充色和边线色。
 *   - enemyFill / enemyLine: AI 地块填充色和边线色。
 *   - captureLine: 占领进度圆环颜色。
 * - viewport: 地图在画布中的自适应参数。
 *   - padding: 左右安全边距，单位像素。
 *   - reservedTop / reservedBottom: 为顶部 HUD 和底部操作栏预留的像素高度。
 *   - minHeight: 地图区域允许使用的最小高度。
 *   - maxScale: 地图最大显示倍率，避免大屏上被过度放大。
 *
 * 数值单位约定
 * - hp / atk / damage: 生命值、普通攻击伤害和技能伤害。
 * - cost / startGold / goldCap: 金币。
 * - income / baseIncome / mineIncome: 金币/秒。
 * - speed: 六边格/秒。
 * - range / aoeRadius / captureRadius / emergencyCityRange: 六边格距离。
 * - atkInterval / spawnInterval / cooldown / reviveTime / duration: 秒。
 * - color: 0xRRGGBB 格式的 PixiJS 颜色。
 *
 * 建筑字段
 * - name: UI 显示名称。
 * - cost: 主动建造费用；null 表示不能从建造菜单主动建造。
 * - hp: 最大生命值。
 * - income: 金矿每秒额外产金。
 * - spawnInterval / unitType: 兵营出兵间隔和生成兵种。
 * - atk / range / atkInterval: 防御塔伤害、射程和攻击间隔。
 * - aoeRadius: 霹雳塔命中后的爆炸半径。
 *
 * 兵种字段
 * - name / hp / atk: 显示名称、最大生命和基础攻击。
 * - speed / atkInterval / range: 移速、攻击间隔和射程。
 * - counters: 该兵种克制的目标兵种 key。
 * - color: 几何占位单位的填充颜色。
 */

// ===== 地图预设 =====
const MAP_CONFIGS = {
  // 标准斜向地图：适合作为默认数值测试场。
  hulao: {
    id: "hulao",
    name: "虎牢关",
    description: "9x7 标准战场，攻守节奏均衡",
    shape: "axialParallelogram",
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
  // 横向加长的斜向地图：探索距离比虎牢关更长。
  chibi: {
    id: "chibi",
    name: "赤壁水寨",
    description: "11x7 狭长战场，探索路线更丰富",
    shape: "axialParallelogram",
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
  // 偏移矩形地图：敌方在上、玩家在下，轴向 r 允许出现负数。
  northSouth: {
    id: "northSouth",
    name: "南北对垒",
    description: "11x8 长方形战场，敌我分处上下中央",
    shape: "offsetRectangle",
    cols: 11,
    rows: 8,
    hexSize: 32,
    initialLayout: {
      playerCity: { q: 5, r: 5 },
      playerTerritory: [{ q: 4, r: 5 }, { q: 6, r: 4 }],
      enemyCity: { q: 5, r: -2 },
      enemyTerritory: [{ q: 4, r: -2 }, { q: 6, r: -3 }],
    },
    colors: {
      unknownFill: 0x302f32,
      unknownLine: 0x5e5b63,
      neutralFill: 0x5c584f,
      neutralLine: 0x9d978a,
      playerFill: 0x2d536f,
      playerLine: 0x72b8e3,
      enemyFill: 0x763b35,
      enemyLine: 0xf08072,
      captureLine: 0xf4cf62,
    },
    viewport: {
      padding: 10,
      reservedTop: 80,
      reservedBottom: 80,
      minHeight: 180,
      maxScale: 1.25,
    },
  },
  northSouthTall: {
    id: "northSouthTall",
    name: "南北长阵",
    description: "9x16 对称纵深战场，双方沿中央纵轴南北推进",
    shape: "offsetRectangle",
    cols: 9,
    rows: 16,
    hexSize: 28,
    initialLayout: {
      playerCity: { q: 4, r: 13 },
      playerTerritory: [{ q: 3, r: 14 }, { q: 5, r: 13 }],
      enemyCity: { q: 4, r: -2 },
      enemyTerritory: [{ q: 3, r: -1 }, { q: 5, r: -2 }],
    },
    colors: {
      unknownFill: 0x2f302b,
      unknownLine: 0x5e6253,
      neutralFill: 0x5b5c50,
      neutralLine: 0x9d9f8d,
      playerFill: 0x285a4f,
      playerLine: 0x6fd1b3,
      enemyFill: 0x713c39,
      enemyLine: 0xe98279,
      captureLine: 0xf3cd61,
    },
    viewport: {
      padding: 10,
      reservedTop: 80,
      reservedBottom: 80,
      minHeight: 180,
      maxScale: 1.2,
    },
  },
};

// ===== 游戏配置 CONFIG =====
const CONFIG = {
  // 首次打开游戏时选中的地图 key，必须存在于 maps 中。
  defaultMap: "hulao",
  // 地图选择菜单使用的全部地图预设。
  maps: MAP_CONFIGS,
  // 当前生效地图；切换地图时 game.js 会把它指向对应 maps 项。
  map: MAP_CONFIGS.hulao,

  // ===== 经济 =====
  economy: {
    startGold: 100, // 每方开局金币。
    baseIncome: 2,  // 每方无条件获得的金币/秒。
    goldCap: 9999,  // 金币库存上限，溢出部分舍弃。
    mineIncome: 5,  // 每座存活金矿提供的金币/秒。
  },

  // ===== 翻格 =====
  reveal: {
    normalCost: 25,             // 普通翻格消耗。
    advancedCostReserved: 250, // 高级翻格预留费用；当前版本尚未启用。
    goldReward: 50,             // 抽中 gold_reward 时实际到账金币。
  },
  revealRates: {
    // 普通翻格累计概率；所有值之和必须为 1，启动时会自动校验。
    normal: {
      empty: 0.45,           // 空地，无建筑。
      gold_mine: 0.15,       // 直接生成金矿。
      random_barracks: 0.15, // 四种兵营中等概率随机一种。
      tower_arrow: 0.10,     // 直接生成箭塔。
      tower_cannon: 0.05,    // 直接生成霹雳塔。
      general_camp: 0.05,    // 生成武将据点并召唤关羽。
      gold_reward: 0.05,     // 地块保持空地，同时获得金币奖励。
    },
  },

  // ===== 对局 =====
  battle: {
    prepareTime: 3,       // 开局不可操作的准备倒计时。
    duration: 180,        // 正式战斗总时长。
    captureTime: 2,       // 持续占领一个空地所需时间。
    captureRadius: 0.35,  // 单位距离地块中心小于该值时参与占领。
    maxUnitsPerSide: 80,  // 每方普通士兵上限；武将不计入。
  },

  // ===== 建筑 =====
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

  // ===== 普通兵种 =====
  units: {
    spear: { name: "枪兵", hp: 80, atk: 12, speed: 1.5, atkInterval: 1, range: 0.6, counters: "cavalry", color: 0xf39c45 },
    cavalry: { name: "骑兵", hp: 70, atk: 15, speed: 2.5, atkInterval: 1.2, range: 0.6, counters: "shield", color: 0x9b653f },
    shield: { name: "盾兵", hp: 150, atk: 8, speed: 1, atkInterval: 1.5, range: 0.6, counters: "archer", color: 0x4e8fc9 },
    archer: { name: "弓兵", hp: 60, atk: 14, speed: 1.5, atkInterval: 1, range: 2, counters: "spear", color: 0x65ad65 },
  },

  // ===== 武将 =====
  general: {
    guanYu: {
      name: "关羽",   // UI 显示名称。
      hp: 240,         // 最大生命。
      atk: 36,         // 普通攻击伤害。
      speed: 1.5,      // 移速，格/秒。
      atkInterval: 1,  // 普通攻击间隔，秒。
      range: 0.6,      // 普通攻击距离，格。
      reviveTime: 15,  // 死亡后的复活等待时间，秒。
      skill: {
        name: "青龙偃月", // 技能显示名称。
        damage: 50,        // 对范围内每个敌方单位造成的伤害。
        range: 1.5,        // 以关羽为中心的技能半径，格。
        cooldown: 5,       // 技能冷却，秒。
      },
    },
  },

  // ===== AI =====
  ai: {
    decisionInterval: 2,   // 两次策略决策之间的秒数。
    maxMines: 2,           // AI 常规经济目标中的金矿数量上限。
    maxBarracks: 3,        // AI 常规扩军目标中的兵营数量上限。
    maxArrowTowers: 2,     // AI 常规防御目标中的箭塔数量上限。
    emergencyCityRange: 3, // 敌军进入主城多少格内时触发紧急建塔。
  },
};

// ===== 运行时派生常量：通常不需要调整 =====
// 双方阵营 key；同时用于金币、统计、单位归属和 HUD 元素 id。
const SIDES = ["player", "enemy"];
// 随机兵营池；random_barracks 会从这里等概率抽取。
const BARRACKS = ["barracks_spear", "barracks_cavalry", "barracks_shield", "barracks_archer"];
// 玩家建造菜单顺序；主城和武将据点不在主动建造列表中。
const BUILDABLE = ["gold_mine", ...BARRACKS, "tower_arrow", "tower_cannon"];
