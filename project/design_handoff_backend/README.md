# 景彩文化 · 器材超市 — 后端接入开发交接包

> 给使用 **Claude Code** 的开发者：这份包说明如何为现有前端原型接入一个**真正可运行的后端**（数据库 + API + 持久化）。
> 推荐工作流写在文末「如何与 Claude Code 同步」。

---

## 1. 这是什么

`design/` 里的文件是一套**用 HTML 写的前端设计原型**——它准确呈现了产品最终的样子和交互，但**不是生产代码**，更**没有后端**。目前所有数据都写死在前端 JS 里（`Canvas.dc.html` 的 `EQUIP / RECORDS / SERVICES / TALENT` 等数组），**刷新页面即重置**。

你的任务：**用一个真实技术栈重建这套界面 + 为它接入后端**，让数据能持久保存、多端共享。前端可以沿用原型的视觉与交互（高保真，颜色/排版/间距可直接照搬），也可以用你选定框架（React / Vue / Next.js 等）的组件库重写 UI。

保真度：**高保真（hifi）**。配色、字体、间距、交互都是最终稿，按原型 1:1 还原即可。

---

## 2. 产品概览

景彩文化是影视拍摄团队的**器材与资源调度平台**，分前台与后台：

**前台（员工/客户自助）**
- **器材超市** — 浏览设备、加入「我的清单」凑一套拍摄器材（3 种布局：货架网格 / 货架通道 / 橱窗）
- **服务超市** — 按拍摄领域（航拍/汽车/TVC/活动/课件/AI）选打包服务，每个包整合 硬件+团队+能力
- **人才库** — 专业团队档案（摄影/灯光/航拍等角色）
- **库存总览** — 设备台账实时概览 + 最近出入库记录
- **我的清单** — 购物车式集合，按天数估算日租 + 押金，提交租赁意向

**后台（管理端）**
- **工作台** — 今日出入库、待检/到期设备等运营概览
- **设备管理** — 设备 CRUD、Excel 批量导入、按类别/状态/所属方筛选、单台/批量改状态、扫码登记
- **出入库记录** — 借还流水，支持快速登记（出库/入库）

---

## 3. 数据模型（后端需要持久化的核心实体）

以下字段直接取自前端原型，可作为数据库表/集合的设计基础。

### 3.1 设备 Equipment（前端 `EQUIP[]`）
| 字段 | 类型 | 含义 | 示例 |
|---|---|---|---|
| id | int (PK) | 设备 ID | 1 |
| name | string | 设备名称 | "ALEXA Mini LF 电影摄影机" |
| brand | string | 品牌 | "ARRI" |
| model | string | 型号 | "Mini LF" |
| cat | enum | 类别键 | "cinema" |
| code | string (唯一) | 设备编号（扫码用） | "CAM-001" |
| st | enum | 状态键 | "in" |
| own | string | 所属方 | "自有" / "合作商" / "个人挂靠" |
| val | int | 设备原值（元） | 320000 |
| day | int | 日租（元/天） | 3800 |
| dep | int | 押金（元） | 80000 |
| tot | int | 总数 | 3 |
| av | int | 当前可借数 | 2 |
| loc | string | 库位 | "A-01" |
| specs | string[] | 规格标签 | ["Super35", …] |
| note | string? | 备注 | — |

**类别 cat 枚举**（前端 `CATS`）：`cinema`电影机 / `lens`镜头 / `light`灯光 / `monitor`监视器 / `support`支架 / `audio`录音 / `fpv`FPV穿越机 / `drone`航拍无人机 / `accessory`附件

**状态 st 枚举**（前端 `STATUS`）：`in`在库 / `reserved`已预留 / `out`已出库 / `repair`维修中 / `inspect`待检查 / `retired`停用

### 3.2 出入库记录 Movement（前端 `RECORDS[]` / `logEntries`）
| 字段 | 类型 | 含义 |
|---|---|---|
| id | string/int (PK) | 记录 ID |
| t | datetime | 时间 |
| dev | string | 设备名称（或外键 equipment_id） |
| op | enum | 操作：出库 / 入库 / 报修 / 预留 / 改状态 |
| by | string | 操作人 |
| proj | string | 关联项目/原因 |

> 业务规则：出库/入库会**改变设备的可借数 `av` 与状态 `st`**，并写一条 Movement。后端应保证两者在一个事务里一致。

### 3.3 服务包 Service（前端 `SERVICES[]`）
`id, name, domain（领域键）, tagline, priceFrom, unit, duration, crew（人数）, hw[]（硬件 {label,detail}）, caps[]（能力）, deliver[]（交付物）, talent[]（关联人才 id）, desc`
领域 domain 枚举（`DOMAINS`）：`aerial`航拍 / `auto`汽车 / `motion`动态影像 / `event`活动 / `course`课件 / `ai`AI制作

### 3.4 人才 Talent（前端 `TALENT[]`）
`id, name, initials, role, roleKey（角色键）, years, color, specialty, skills[], gear[], projects[]（{name,…}）`
角色 roleKey 枚举见前端 `ROLES`（DP摄影指导、gaffer灯光、aerial航拍等）。

### 3.5 清单/租赁意向 Cart / RentalOrder（前端 `state.cart`）
购物车结构 `{ equipmentId: qty }`，结算时按 `天数 days` 估算日租合计与押金合计。提交后应生成一条**租赁意向单**（客户/项目/起止日期/明细/金额），进入后台审批/出库流程。

### 3.6 服务意向（`orderService`）
前端目前只弹 toast。后端应落库为**服务咨询线索**（服务包 id / 联系人 / 时间），供顾问跟进。

---

## 4. 后端要补的接口（建议 REST，命名供参考）

设备
- `GET  /api/equipment` 列表（支持 cat/brand/status/owner/search/sort 查询参数）
- `GET  /api/equipment/:id`
- `POST /api/equipment` 新增（对应前端 `saveDraft`）
- `PUT  /api/equipment/:id` 编辑
- `DELETE /api/equipment/:id` / 批量删除（`batchDelete`）
- `PATCH /api/equipment/:id/status` 改状态（`setStatus` / `batchStatus`）
- `POST /api/equipment/import` Excel 批量导入（前端用 xlsx 解析，建议改为**后端解析 + 校验入库**）
- `GET  /api/equipment/by-code/:code` 扫码查设备（`processScanCode`）

出入库
- `GET  /api/movements` 记录列表
- `POST /api/movements` 登记出库/入库（`submitReg`，需事务性更新设备 av/st）

服务 / 人才（多为读取）
- `GET /api/services` `GET /api/services/:id`
- `GET /api/talents` `GET /api/talents/:id`

清单/意向
- `POST /api/rental-orders` 提交租赁意向（购物车结算）
- `POST /api/service-inquiries` 提交服务意向

仪表盘
- `GET /api/dashboard/summary` 今日出入库、待检/到期、库存统计

> 建议加一层鉴权：前台（员工/客户）与后台（管理员）权限分离。

---

## 5. 关键交互与状态（实现时注意）

- **清单估价**：`行金额 = day × qty × days`；底部汇总日租合计与押金合计。
- **扫码登记**：监听键盘快速连续输入（扫码枪）回车触发查码；也支持摄像头扫码。后端只需提供 `by-code` 查询。
- **Excel 导入**：列序「设备名称 | 品牌 | 型号 | 类别 | 编号 | 状态 | 所属方 | …」，含中文类别/状态到枚举键的映射表（见 `Canvas.dc.html` 的 `catMap` / `stMap`，可直接迁移到后端）。
- **状态改变联动**：任何状态变更都应写一条 Movement 并刷新可借数。
- **Toast 反馈**：所有写操作成功后前端给轻提示，沿用即可。

设计令牌（高保真，可直接取用）
- 主背景 `#FAFAF8`，文字 `#1C1B19`，次要文字 `#76746E / #9C9A93`，描边 `#E9E8E4 / #E4E3DE`
- 主蓝（强调/按钮）`#2F5AC7`，浅蓝底 `#EEF2FD`，选中文字底 `#D9E2FA`
- 状态色用 oklch（见 `STATUS` / `opColor`）
- 字体：正文 `Noto Sans SC`；数字/编号 `JetBrains Mono`
- 圆角 8–14px；卡片浅阴影 `0 8px 24px rgba(20,20,18,.08)`

---

## 6. 文件清单（design/）

- `Canvas.dc.html` — **主程序**：前台四个页 + 后台三个页的全部 UI 与逻辑、以及全部种子数据（EQUIP/RECORDS/SERVICES/TALENT/CATS/STATUS/DOMAINS/ROLES）。**这是最重要的参考文件**，数据模型与业务规则都在这里。
- `Card.dc.html` — 器材卡片子组件。
- `support.js` — 原型运行时（设计工具用，**生产环境不需要**）。
- `assets/logo.png` — 品牌 Logo。
- `景彩文化-器材超市-bundled.html` — 打包成单文件的版本，**双击即可在浏览器打开预览**最终效果，不依赖任何工具。

> `.dc.html` 是设计工具的组件格式。用 Claude Code 时，把它当作**带完整逻辑的设计参考**来读——重点抽取里面的数据结构、枚举、业务规则和样式值，在你的目标框架里重建，不要直接照搬这套运行时。

---

## 7. 如何与 Claude Code 同步（推荐工作流）

1. **下载本交接包**（聊天里的下载卡片），解压到本地一个文件夹，例如 `jingcai-app/`。
2. 在该文件夹打开终端，运行 `claude`（Claude Code）。
3. 先让它读懂设计：
   > "读 design/Canvas.dc.html 和这份 README，告诉我你理解的数据模型和要做的后端。"
4. 选技术栈并搭后端，例如：
   > "用 Node + Express + Prisma + SQLite（或 PostgreSQL）按 README 第 3、4 节建数据库和 REST API，把前端写死的种子数据迁成数据库 seed。"
5. 重建前端并对接接口：
   > "用 React + Vite 按 design/ 里的原型 1:1 重建界面，数据改为调用上一步的 API。"
6. 用 `景彩文化-器材超市-bundled.html` 对照视觉，逐页验收。

完成后用 git 管理，推到你的 GitHub 仓库即可团队协作。

> 备注：如果你更想要"零代码改动地把这个原型直接挂个数据库"，那是做不到的——原型没有后端层。正确路径就是上面的「重建 + 接后端」，Claude Code 会替你完成绝大部分工作。
