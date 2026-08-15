# 《大王请留步》— PixiJS 单文件版 开发需求文档（Codex 专用提示词）

> 将本文档整体粘贴给 Codex / Cursor / Copilot。目标：生成一个**单个 index.html 文件**，浏览器直接打开即可运行的完整可玩游戏原型。零安装、零构建、零依赖（PixiJS 通过 CDN 引入）。

---

## 一、任务目标

你是一名资深游戏前端工程师。请根据以下需求，生成**一个完整的 `index.html` 文件**，实现三国题材六边形沙盘实时对战策略游戏《大王请留步》的核心可玩原型。

**硬性要求：**
- 单个 HTML 文件，内嵌 CSS + JS，浏览器双击直接运行
- PixiJS v7 通过 CDN 引入（`<script src="https://cdn.jsdelivr.net/npm/pixi.js@7.x/dist/pixi.min.js"></script>`）
- 游戏画面用 PixiJS（Canvas/WebGL）渲染，UI 用原生 DOM + CSS
- 纯 JavaScript（ES6+），不使用 TypeScript、不使用构建工具
- 所有配置（数值、概率、兵种属性）以 JS 对象形式写在文件顶部，便于调参
- 代码结构清晰，分模块注释，每个功能块用 `// ===== 模块名 =====` 分隔
- 先用简单几何图形占位美术（六边形用 PIXI.Graphics 绘制，士兵用彩色圆/方），标注资源替换位置
- 完成后必须能进行一场完整的人机对战（PvE），从开局到胜负结算

---

## 二、游戏概述

- **类型**：三国 Q版 六边形沙盘 实时对战 策略塔防
- **单局时长**：约 2~3 分钟（180秒倒计时）
- **模式**：玩家 vs AI（人机对战）
- **核心循环**：翻格探图 → 建金矿攒经济 → 造兵营出兵 → 建塔防守 → 推平敌方主城获胜
- **胜利条件**：摧毁敌方主城 OR 时间结束时己方领地面积更大

---

## 三、核心玩法机制（必须全部实现）

### 3.1 六边形地图

- 地图尺寸：**9列 × 7行** 六边形网格（轴向坐标 q, r）
- 使用**平顶六边形（flat-top）**，尺寸 size=36px
- 地块类型：
  - `unknown`：未翻开（显示问号，深色覆盖）
  - `empty`：空白地块（可建造）
  - `gold_mine`：金矿
  - `barracks_spear`：枪兵营
  - `barracks_cavalry`：骑兵营
  - `barracks_shield`：盾兵营
  - `barracks_archer`：工兵营（弓兵）
  - `tower_arrow`：箭塔
  - `tower_cannon`：霹雳塔（AOE）
  - `general`：武将据点
  - `main_city`：主城
- 每个地块有 `owner`：`"player"` / `"enemy"` / `"none"`
- 玩家初始：左下角主城 + 周围2格领地
- 敌方初始：右上角主城 + 周围2格领地
- 其余地块均为 unknown

### 3.2 翻格机制

- 只能翻开与己方领地**相邻**的 unknown 地块
- **普通翻格**：消耗 25 金币，随机结果
- **高级翻格**：消耗 250 金币，稀有概率提升（右键或长按切换，原型阶段先只做普通翻格，高级翻格作为可选扩展）
- 翻格概率表：

| 结果 | 普通格概率 |
|------|-----------|
| empty | 45% |
| gold_mine | 15% |
| barracks（随机兵种） | 15% |
| tower_arrow | 10% |
| tower_cannon | 5% |
| general | 5% |
| 金币奖励(+50) | 5% |

- 翻开后地块归属当前玩家

### 3.3 经济系统

- 初始金币：100
- 基础产出：2 金币/秒
- 每座金矿：+5 金币/秒
- 金币上限：9999
- 金币不足时翻格/建造按钮置灰不可点
- 顶部 HUD 实时显示双方金币

### 3.4 建筑系统

在己方 empty 地块上点击可弹出建造菜单，可选：

| 建筑 | 建造费用 | 生命值 | 功能 |
|------|---------|--------|------|
| 金矿 | 50 | 200 | +5金币/秒 |
| 枪兵营 | 80 | 300 | 每3秒出一个枪兵 |
| 骑兵营 | 80 | 300 | 每3秒出一个骑兵 |
| 盾兵营 | 80 | 300 | 每3秒出一个盾兵 |
| 工兵营 | 80 | 300 | 每3秒出一个工兵 |
| 箭塔 | 60 | 250 | 单体攻击，范围2格，攻速1秒 |
| 霹雳塔 | 120 | 250 | AOE攻击，范围2.5格，攻速2秒，伤害30 |

- 建筑被攻击到血量归零则摧毁，地块变回 empty，归属变 none
- 主城生命值 1000，被摧毁则该方失败

### 3.5 兵种与克制

| 兵种 | 生命 | 攻击 | 移速(格/秒) | 攻击间隔 | 攻击距离 | 克制 |
|------|------|------|------------|---------|---------|------|
| 枪兵 | 80 | 12 | 1.5 | 1.0s | 近战(0.6格) | 骑兵 |
| 骑兵 | 70 | 15 | 2.5 | 1.2s | 近战(0.6格) | 盾兵 |
| 盾兵 | 150 | 8 | 1.0 | 1.5s | 近战(0.6格) | 工兵 |
| 工兵 | 60 | 14 | 1.5 | 1.0s | 远程(2格) | 枪兵 |

- 克制关系：枪→骑→盾→工→枪（循环）
- 克制方伤害 ×1.5，被克制方伤害 ×0.75
- 士兵从兵营生成后，自动寻路向敌方主城移动
- 途中遇到敌方单位自动停下交战
- 走到敌方地块上停留 2 秒可占领该地块（占领期间显示进度条）
- 士兵死亡后消失

### 3.6 武将系统（简化版）

- 翻格有概率获得 general 地块，自动召唤一个武将单位
- 武将是超级士兵，属性为普通兵种的 3 倍
- 原型阶段实现 1 个武将即可：**关羽**（近战，生命240，攻击36，移速1.5，每5秒释放一次范围AOE伤害50）
- 武将死亡后 15 秒在原 general 地块复活（如果地块仍属己方）

### 3.7 战斗流程

1. 开局 3 秒准备（显示倒计时）
2. 180 秒战斗计时
3. 双方实时操作，士兵自动战斗
4. 任意一方主城被摧毁 → 立即结束
5. 时间到 → 比较领地格数，多者胜；相同则比较剩余建筑总血量
6. 结算面板显示胜负、击杀数、领地数、产金量

### 3.8 AI 策略

敌方 AI 按以下简单逻辑运行（每 2 秒决策一次）：
1. 如果金币 ≥ 25 且有相邻 unknown 地块 → 翻格（优先翻靠近金矿方向的）
2. 如果金币 ≥ 50 且有己方 empty 地块且金矿 < 2 座 → 建金矿
3. 如果金币 ≥ 80 且有己方 empty 地块且兵营 < 3 座 → 建兵营（随机兵种）
4. 如果金币 ≥ 60 且前线有 empty 地块 → 建箭塔
5. 不主动升级，不使用高级翻格

---

## 四、技术实现规范

### 4.1 文件结构（单 HTML 文件内的代码组织）

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>大王请留步</title>
  <style>
    /* ===== 全局样式 ===== */
    /* ===== 顶部HUD样式 ===== */
    /* ===== 底部卡牌/操作栏样式 ===== */
    /* ===== 建造菜单样式 ===== */
    /* ===== 结算面板样式 ===== */
  </style>
</head>
<body>
  <!-- 游戏画布容器 -->
  <div id="game-container"></div>
  <!-- 顶部HUD -->
  <div id="hud">...</div>
  <!-- 底部操作栏 -->
  <div id="bottom-bar">...</div>
  <!-- 建造菜单（动态显示） -->
  <div id="build-menu">...</div>
  <!-- 结算面板 -->
  <div id="result-panel">...</div>

  <script src="https://cdn.jsdelivr.net/npm/pixi.js@7.x/dist/pixi.min.js"></script>
  <script>
    // ===== 配置表 CONFIG =====
    // ===== 六边形工具 HexUtils =====
    // ===== 游戏状态 GameState =====
    // ===== 地图管理 MapManager =====
    // ===== 经济管理 EconomyManager =====
    // ===== 建筑系统 Building =====
    // ===== 单位系统 Unit =====
    // ===== 寻路 PathFinder =====
    // ===== 战斗管理 BattleManager =====
    // ===== AI控制器 AIController =====
    // ===== Pixi渲染层 Renderer =====
    // ===== UI控制 UIController =====
    // ===== 主循环与初始化 =====
  </script>
</body>
</html>
```

### 4.2 六边形坐标工具（必须正确实现）

```javascript
const HexUtils = {
  size: 36,  // 六边形外接圆半径（flat-top）
  
  // 轴向坐标 (q, r) → 像素坐标 (flat-top)
  axialToPixel(q, r) {
    const x = this.size * (3/2 * q);
    const y = this.size * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r);
    return { x, y };
  },
  
  // 像素坐标 → 轴向坐标（鼠标点击判定用）
  pixelToAxial(x, y) {
    const q = (2/3 * x) / this.size;
    const r = (-1/3 * x + Math.sqrt(3)/3 * y) / this.size;
    return this.round(q, r);
  },
  
  // 六边形坐标取整
  round(q, r) {
    const s = -q - r;
    let rq = Math.round(q), rr = Math.round(r), rs = Math.round(s);
    const qd = Math.abs(rq - q), rd = Math.abs(rr - r), sd = Math.abs(rs - s);
    if (qd > rd && qd > sd) rq = -rr - rs;
    else if (rd > sd) rr = -rq - rs;
    return { q: rq, r: rr };
  },
  
  // 六个方向偏移（flat-top）
  directions: [
    {q: 1, r: 0}, {q: 1, r: -1}, {q: 0, r: -1},
    {q: -1, r: 0}, {q: -1, r: 1}, {q: 0, r: 1}
  ],
  
  // 获取邻居
  neighbors(q, r) {
    return this.directions.map(d => ({ q: q + d.q, r: r + d.r }));
  },
  
  // 两格距离
  distance(q1, r1, q2, r2) {
    return (Math.abs(q1 - q2) + Math.abs(q1 + r1 - q2 - r2) + Math.abs(r1 - r2)) / 2;
  },
  
  // 绘制六边形路径（PIXI.Graphics 用）
  drawHex(graphics, x, y, size, fillColor, lineColor, lineWidth = 2) {
    graphics.beginFill(fillColor);
    graphics.lineStyle(lineWidth, lineColor);
    graphics.moveTo(size, 0);
    for (let i = 1; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      graphics.lineTo(size * Math.cos(angle), size * Math.sin(angle));
    }
    graphics.closePath();
    graphics.endFill();
  }
};
```

### 4.3 寻路（A*，六边形）

- 基于六边形距离做启发函数
- 可通行条件：地块不是 unknown，且不是敌方建筑（敌方单位可攻击但不阻挡寻路，绕路优先）
- 每个单位缓存寻路结果，当地图变化时重新计算
- 原型阶段可以简化为：每帧朝目标方向移动，遇到阻挡尝试绕行

### 4.4 渲染层规范

- **地图层**：所有六边形地块，用 PIXI.Graphics 绘制，不同类型/归属不同颜色
  - player 领地：绿色系
  - enemy 领地：红色系
  - none：灰色
  - unknown：深灰 + 问号文字
- **建筑层**：在地块中心绘制建筑图标（用简单几何图形：金矿=黄色圆，兵营=蓝色方，塔=紫色三角，主城=金色大六边形）
- **单位层**：士兵用小圆点，不同兵种不同颜色，武将用大圆点+光环
  - 枪兵=橙色，骑兵=棕色，盾兵=蓝色，工兵=绿色
  - 玩家单位描边绿色，敌方单位描边红色
- **血条层**：建筑和单位头顶显示小血条（用 PIXI.Graphics 画矩形）
- **特效层**：攻击连线、AOE圆圈、占领进度条
- 整个地图可拖拽平移，可选滚轮缩放（原型阶段先固定视角，地图居中显示）

### 4.5 主循环

```javascript
let lastTime = 0;
function gameLoop(ticker) {
  const dt = ticker.deltaMS / 1000;  // 秒
  const dtScaled = Math.min(dt, 0.1); // 防止切后台后大跳
  
  economyManager.tick(dtScaled);
  buildingManager.tick(dtScaled);
  unitManager.tick(dtScaled);
  aiController.tick(dtScaled);
  battleManager.checkVictory();
  renderer.update();
  uiController.update();
}
```

- 逻辑更新和渲染都在 requestAnimationFrame（PIXI.Ticker）中
- 单位移动用 dt 缩放，保证不同帧率下速度一致

### 4.6 交互规范

- 点击 unknown 地块（己方相邻）→ 翻格
- 点击己方 empty 地块 → 弹出建造菜单
- 点击己方建筑 → 显示建筑信息（血量/产出），原型阶段可不做升级
- 点击敌方地块/单位 → 显示信息，无操作
- 建造菜单点击建筑类型 → 建造并关闭菜单
- 点击空白处 → 关闭建造菜单

---

## 五、UI 界面（DOM + CSS）

### 5.1 顶部 HUD
```
┌──────────────────────────────────────────────────┐
│ 🔴敌方 金币:120 领地:15格   ⏱02:15   💰180 领地:12格 🟢我方 │
└──────────────────────────────────────────────────┘
```
- 固定在页面顶部，半透明黑色背景
- 显示双方金币、领地格数、中间倒计时

### 5.2 底部操作提示栏
- 显示当前选中地块信息
- 显示操作提示（"点击问号地块翻格" / "选择要建造的建筑"）
- 一个「重新开始」按钮

### 5.3 建造菜单（点击 empty 地块弹出）
- 浮动在地块附近
- 列出可建造建筑及费用
- 金币不足的选项置灰
- 关闭按钮

### 5.4 结算面板
- 居中半透明遮罩
- 大字显示「胜利！」或「失败」
- 战绩数据：击杀士兵数、占领地块数、总产金量
- 「再来一局」按钮

---

## 六、配置表（写在 JS 顶部，可直接修改）

```javascript
const CONFIG = {
  map: { cols: 9, rows: 7, hexSize: 36 },
  economy: { startGold: 100, baseIncome: 2, goldCap: 9999, mineIncome: 5 },
  reveal: { normalCost: 25, advCost: 250 },
  battle: { duration: 180, prepareTime: 3, captureTime: 2 },
  buildings: {
    gold_mine:   { name: "金矿",   cost: 50,  hp: 200, income: 5 },
    barracks:    { name: "兵营",   cost: 80,  hp: 300, spawnInterval: 3 },
    tower_arrow: { name: "箭塔",   cost: 60,  hp: 250, atk: 15, range: 2,   atkInterval: 1 },
    tower_cannon:{ name: "霹雳塔", cost: 120, hp: 250, atk: 30, range: 2.5, atkInterval: 2, aoe: true },
    main_city:   { name: "主城",   cost: 0,   hp: 1000 },
  },
  units: {
    spear:   { name: "枪兵", hp: 80,  atk: 12, speed: 1.5, atkInterval: 1.0, range: 0.6, counters: "cavalry" },
    cavalry: { name: "骑兵", hp: 70,  atk: 15, speed: 2.5, atkInterval: 1.2, range: 0.6, counters: "shield" },
    shield:  { name: "盾兵", hp: 150, atk: 8,  speed: 1.0, atkInterval: 1.5, range: 0.6, counters: "archer" },
    archer:  { name: "工兵", hp: 60,  atk: 14, speed: 1.5, atkInterval: 1.0, range: 2.0, counters: "spear" },
  },
  general: {
    guan_yu: { name: "关羽", hp: 240, atk: 36, speed: 1.5, atkInterval: 1.0, range: 0.6, skill: { name: "青龙偃月", damage: 50, range: 1.5, cooldown: 5 } },
  },
  revealRates: {
    normal: { empty: 0.45, gold_mine: 0.15, barracks: 0.15, tower_arrow: 0.10, tower_cannon: 0.05, general: 0.05, gold_reward: 0.05 },
  },
  ai: { decisionInterval: 2, maxMines: 2, maxBarracks: 3 },
};
```

---

## 七、给 Codex 的执行指令

请严格按照以下顺序开发，每一步完成后确保代码可运行：

1. **先搭骨架**：创建 HTML 结构、CSS 样式、PixiJS 初始化（创建 Application，挂载到 #game-container），实现空的游戏循环
2. **六边形地图**：实现 HexUtils，在 Canvas 上绘制 9×7 六边形网格，支持鼠标悬停高亮，点击能输出对应 (q, r) 坐标
3. **地块状态与翻格**：实现地块数据结构，unknown/empty 状态切换，点击相邻 unknown 地块消耗金币翻开，按概率随机结果
4. **经济系统**：金币自动产出（基础+金矿），HUD 实时更新，金币不足时操作无效
5. **建筑系统**：点击 empty 地块弹出建造菜单，建造后建筑生效（金矿产金、兵营出兵、塔攻击），建筑有血量可被摧毁
6. **单位系统**：实现士兵生成、移动、攻击、死亡，兵种克制伤害计算，寻路（简化版即可）
7. **占领机制**：士兵走到敌方地块停留占领
8. **武将系统**：关羽的生成、AOE技能、复活
9. **AI 对手**：按策略自动翻格、建造
10. **胜负判定与结算**：主城血量、倒计时、领地统计、结算面板
11. ** polish**：血条、攻击特效、占领进度条、拖拽平移地图、开始/重新开始流程

**关键约束：**
- 每写完一个模块，在脑中模拟运行，确保没有引用未定义的变量/函数
- 所有事件绑定在初始化时完成，不要有遗漏的 DOM 元素
- PixiJS 的 Graphics 绘制要注意 clear() 后重绘，避免内存泄漏
- 单位数量多时用对象池（可选，原型阶段先直接 new，超过 80 个时再优化）
- 代码中用 `// TODO: 替换为正式美术资源` 标注占位图位置
- 最终输出一个完整的、可直接运行的 index.html 文件，不要拆分文件

---

*文档版本：v2.0 (PixiJS单文件版) | 生成日期：2026-08-15*
