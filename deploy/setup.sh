#!/usr/bin/env bash
# 一键部署器材管理平台（前端 + 本机 PostgreSQL 后端）到 Ubuntu 22.04 服务器。
# 在服务器上、项目根目录执行：  bash deploy/setup.sh
# 幂等：可重复执行（不会覆盖已有 .env.local / 已建的库和账号密码）。
set -euo pipefail

APP_NAME="equipment-platform"
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
NODE_MAJOR=20
DB_NAME=equipment
DB_USER=equipment

echo "==> [1/8] 安装 Node ${NODE_MAJOR}"
if ! command -v node >/dev/null 2>&1 || [ "$(node -v | sed 's/v//;s/\..*//')" -lt 18 ]; then
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
  apt-get install -y nodejs
fi
echo "    node $(node -v) / npm $(npm -v)"

echo "==> [2/8] 安装 pm2 与 nginx"
npm install -g pm2 >/dev/null 2>&1 || npm install -g pm2
apt-get install -y nginx >/dev/null

echo "==> [3/8] 安装 PostgreSQL"
apt-get install -y postgresql postgresql-contrib >/dev/null
systemctl enable --now postgresql

echo "==> [4/8] 建库与生成 .env.local（首次运行时）"
if [ ! -f "$APP_DIR/.env.local" ]; then
  DB_PASS="$(openssl rand -hex 16)"
  sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1 \
    || sudo -u postgres psql -c "CREATE ROLE $DB_USER LOGIN PASSWORD '$DB_PASS'"
  sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1 \
    || sudo -u postgres createdb -O "$DB_USER" "$DB_NAME"
  cat > "$APP_DIR/.env.local" <<EOF
DATABASE_URL=postgresql://$DB_USER:$DB_PASS@127.0.0.1:5432/$DB_NAME
SESSION_SECRET=$(openssl rand -hex 32)
NEXT_PUBLIC_ENABLE_DB=1
EOF
  chmod 600 "$APP_DIR/.env.local"
  echo "    已生成 $APP_DIR/.env.local（数据库密码随机，妥善保管该文件）"
else
  echo "    .env.local 已存在，跳过生成"
fi

echo "==> [5/8] 应用数据库 schema（幂等）"
# 用 stdin 重定向而不是 -f：postgres 系统用户没有权限读 /root 下的文件
sudo -u postgres psql -d "$DB_NAME" < "$APP_DIR/db/schema.sql" >/dev/null
sudo -u postgres psql -d "$DB_NAME" -c "GRANT ALL ON ALL TABLES IN SCHEMA public TO $DB_USER; GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;" >/dev/null
echo "    schema 已应用，权限已授予"

echo "==> [6/8] 安装依赖并构建（NEXT_PUBLIC_ENABLE_DB 需在构建前就位）"
cd "$APP_DIR"
npm ci
npm run build

echo "==> [7/8] 创建内部成员账号 + pm2 守护启动 (端口 3000)"
node scripts/create-users.mjs || echo "    !! 建号脚本失败，可稍后手动执行 node scripts/create-users.mjs"
pm2 delete "$APP_NAME" >/dev/null 2>&1 || true
pm2 start npm --name "$APP_NAME" -- run start
pm2 save
pm2 startup systemd -u root --hp /root >/dev/null 2>&1 || true

echo "==> [8/8] 配置 nginx 反向代理 (80 → 3000)"
cp "$APP_DIR/deploy/nginx-equipment.conf" /etc/nginx/sites-available/${APP_NAME}
ln -sf /etc/nginx/sites-available/${APP_NAME} /etc/nginx/sites-enabled/${APP_NAME}
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

IP=$(curl -s --max-time 5 https://api.ipify.org || echo "<公网IP>")
echo ""
echo "✅ 部署完成 → 浏览器访问  http://${IP}"
echo "   冒烟测试： node scripts/smoke-test.mjs http://127.0.0.1"
echo "   常用命令： pm2 logs ${APP_NAME}   |   pm2 restart ${APP_NAME}"
