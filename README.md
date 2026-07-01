# 景彩文化 · 器材超市

影视器材租赁与服务平台 —— Next.js 14 (App Router) + TypeScript + Tailwind CSS + Zustand，可选接入 Supabase。

- **器材超市** `/catalog`：46 件器材，三种布局(货架网格 / 分区货架 / 大图筛选)、分类/品牌/状态筛选、排序、租用清单
- **服务超市** `/services`：6 个服务包，按领域筛选
- **人才库** `/talent`：9 位专业成员，按角色筛选
- **库存总览** `/dashboard`：统计卡、状态分布、类别库存、出入库记录
- **后台管理** `/admin`：工作台、设备管理(增删改 / 批量 / Excel 导入)、出入库记录(扫码登记)

---

## 一、本地开发环境准备

安装三样:

- [Node.js](https://nodejs.org) 18 或 20 LTS
- [Git](https://git-scm.com)
- [VS Code](https://code.visualstudio.com)

## 二、拉取项目

在 VS Code 终端(`` Ctrl+` ``)执行:

```bash
git clone https://github.com/a17181710606-prog/-_-_0.01.git
cd -_-_0.01
code .
```

## 三、本地跑起来

```bash
npm install
cp .env.local.example .env.local   # 先不填也能跑,用内置种子数据
npm run dev                        # 打开 http://localhost:3000
```

> ⚠️ 不要在同一目录同时跑 `npm run dev` 和 `npm start`,会污染 `.next` 构建目录导致 500。
> 要测生产版:先 `npm run build`,再 `npm start`。

## 四、连接 GitHub 自动上传

**先在 VS Code 登录 GitHub(一次即可):** 左下角头像图标 → *Sign in to GitHub* → 浏览器授权。

**方式 A(推荐 · 半自动):**
1. 左侧「源代码管理」面板 → 填提交信息 → 点 **✓ 提交**
2. 点 **↻ Sync Changes** 推送到 GitHub
3. 设置里勾上 `git.autofetch` 自动拉取远端更新

**方式 B(全自动 · 保存即上传):** 安装扩展 **GitDoc** → 命令面板 `GitDoc: Enable` → 每次保存自动 commit + push。历史会较碎,适合个人快速迭代,可随时 `GitDoc: Disable`。

## 五、自动部署(Vercel)

在 [Vercel](https://vercel.com) 用 GitHub 登录并 Import 本仓库后,每次 push 会自动构建上线:

```
VS Code 提交 → 推送 GitHub → Vercel 自动部署 → 线上更新
```

---

## 环境变量

`.env.local`(不提交到 git):

```
NEXT_PUBLIC_SUPABASE_URL=https://你的项目.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的 anon key
```

不填则使用内存种子数据(`lib/data.ts`)。填写后数据库结构见 `supabase/migrations/001_schema.sql`,在 Supabase SQL Editor 执行即可建表。

## 项目结构

```
app/            页面路由(catalog / services / talent / dashboard / admin)
components/     组件(equipment / services / talent / dashboard / admin / layout / ui)
lib/            types / constants / data(种子数据) / store(Zustand) / supabase / utils
supabase/       数据库迁移 SQL
public/assets/  Logo 等静态资源
```

## 常用命令

```bash
npm run dev     # 开发
npm run build   # 生产构建
npm start       # 运行生产构建
npm run lint    # 代码检查
```

---

> 原始设计稿(Claude Design 导出的 HTML 原型)保留在 `project/`,设计对话记录在 `chats/`,供比对参考。
