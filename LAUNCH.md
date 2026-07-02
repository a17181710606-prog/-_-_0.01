# 上线部署指引（内部测试版 · 自托管架构）

面向约 5 名公司内部成员开放登录。**前端、API、数据库、账号全部跑在同一台国内 ECS 上**，
无任何第三方云服务依赖，全程国内网络。

## 架构

```
浏览器 → nginx(80) → Next.js(3000, pm2 守护)
                       ├─ 页面（前台超市 + 后台管理）
                       └─ /api 路由 → PostgreSQL(本机 127.0.0.1:5432)
                                        ├─ equipment / movements / orders / inquiries
                                        └─ users(bcrypt 密码哈希) / sessions(登录会话)
```

## 一、部署 / 更新

```bash
# 本地推代码（注意 --exclude .env.local，别覆盖服务器生成的密钥）
rsync -az -e 'ssh -i <你的.pem>' \
  --exclude node_modules --exclude .next --exclude .git --exclude .env.local \
  ./ root@<服务器IP>:/root/equipment-platform/

# 服务器上执行（幂等，可重复跑）
cd /root/equipment-platform && bash deploy/setup.sh
```

`setup.sh` 自动完成：装 Node/pm2/nginx/PostgreSQL → 首次运行时建库、生成 `.env.local`
（随机数据库密码 + NEXT_PUBLIC_ENABLE_DB=1）→ 应用 `db/schema.sql`（幂等）→ 构建 →
创建成员账号 → pm2 守护 → nginx 反代。

## 二、成员账号

- 名单维护在 `scripts/create-users.mjs` 的 `MEMBERS` 里（邮箱/初始密码/姓名）。
- 服务器上运行 `node scripts/create-users.mjs` 创建；**重复运行不会覆盖已改的密码**。
- 密码以 bcrypt 哈希入库，绝不存明文。

## 三、导入真实设备数据

- **Excel 导入**：登录后台 → 设备管理 → 导入，上传 xlsx。
  支持列名（中/英）：名称、品牌、型号、分类、编号、状态、日租、押金、价值、总数量、可用数量、位置、备注。
- **逐台录入**：设备管理 → 新增设备。
- 分类/状态用系统 ID：分类见 `lib/constants.ts` 的 CATS；
  状态：`in 在库 / reserved 已预留 / out 已出库 / repair 维修中 / inspect 待检查 / retired 已退役`。

## 四、验证

```bash
# 冒烟测试（匿名读/匿名写401/登录/增删查/记录/登出后401）
node scripts/smoke-test.mjs http://<服务器IP>
```

## 权限模型（复刻自原 RLS 设计）

- 前台（器材/服务/人才/总览）**匿名可读**；租用申请、服务咨询匿名可提交。
- 设备与出入库记录的**写操作需登录**（httpOnly cookie 会话，30 天有效）。
- 5 名成员共享同一份数据，实时落库，刷新不丢，pm2 重启会话不失效（session 存 PG）。

## 本地开发（Mac）

- 日常 UI 开发：不设 `NEXT_PUBLIC_ENABLE_DB` → 自动走本地种子数据，零依赖。
- 全链路调试：`ssh -L 5433:127.0.0.1:5432 root@<服务器IP>` 隧道连服务器库，
  本地 `.env.local` 填 `DATABASE_URL=postgresql://equipment:<密码>@127.0.0.1:5433/equipment` + `NEXT_PUBLIC_ENABLE_DB=1`。

## 后续待办

- [ ] 绑定公司域名（DNS A 记录 → 服务器 IP，nginx server_name）
- [ ] 上 HTTPS（certbot / Let's Encrypt），然后把 `lib/server/session.ts` 里 cookie 的 `secure` 改为 `true`
- [ ] 数据库定期备份（`pg_dump equipment` + crontab）
