# 上线部署指引（内部测试版）

面向约 5 名公司内部成员开放登录，登录后同步真实设备数据做内部测试。

## 一、准备 Supabase 项目

1. 在 https://supabase.com 创建一个项目。
2. 打开 **SQL Editor**，把 `supabase/migrations/001_schema.sql` 全部内容粘贴执行，
   建好 `equipment / movements / rental_orders / service_inquiries` 四张表及 RLS 策略。
3. 到 **Project Settings → API** 拿三样东西：
   - Project URL
   - `anon` public key
   - `service_role` key（仅本地建号脚本用，**切勿**放进前端或提交仓库）

## 二、配置环境变量

在项目根目录新建 `.env.local`（参考 `.env.local.example`）：

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon_key
SUPABASE_SERVICE_ROLE_KEY=你的service_role_key
```

> `NEXT_PUBLIC_` 开头的两个会打进前端（anon key 本就是公开可用的，安全）。
> `SUPABASE_SERVICE_ROLE_KEY` 只用于下面的建号脚本，不会进前端包。

## 三、创建 5 个成员账号

1. 编辑 `scripts/create-users.mjs` 里的 `MEMBERS` 名单（邮箱、初始密码、姓名）。
2. 运行：
   ```
   node scripts/create-users.mjs
   ```
3. 把邮箱 + 初始密码分发给对应成员。（也可在 Supabase 后台 Authentication → Users 手动加）

## 四、导入真实设备数据

两种方式任选：

- **Excel 导入**：登录后台 → 设备管理 → 导入，上传 xlsx。
  支持列名（中/英）：名称、品牌、型号、分类、编号、状态、日租、押金、价值、总数量、可用数量、位置、备注。
- **逐台录入**：设备管理 → 新增设备。

> 分类(cat)/状态(st) 用系统 ID：分类见 `lib/constants.ts` 的 CATS；
> 状态 ID：`in 在库 / reserved 已预留 / out 已出库 / repair 维修中 / inspect 待检查 / retired 已退役`。

## 五、启动

- 本地验证：`npm run dev`（默认 3000 端口）
- 生产构建：`npm run build && npm run start`
- 部署到 Vercel：导入仓库，把上面的环境变量填进 Vercel，Deploy 即可。

## 数据与权限说明

- 前台超市（器材/服务/人才/总览）**匿名可读**；后台管理需登录。
- 已登录成员对设备、出入库记录有完整读写权限（RLS：`authenticated` 可写）。
- 5 名成员共享同一份后端数据，任何人的新增/修改实时落库，刷新不丢失。
- 未配置 Supabase 时应用仍可运行，但走本地示例数据、无法登录（登录页会明确提示）。

## 本轮已修复 / 优化的问题

- 数据层从「纯内存种子数据」接入 Supabase，实现多人共享 + 持久化。
- 登录由「前端硬编码单账号」升级为 Supabase Auth 多账号真实鉴权。
- 工作台「今日出/入库」改为按当天日期真实统计（原为写死的假值）。
- 设备编辑补齐「总数量」字段；Excel 导入修正了「总数量」被误映射为「月租」的问题。
- 所有写操作增加失败提示（网络/登录态异常时给出 toast，不再静默丢数据）。
