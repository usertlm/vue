#!/bin/bash

echo "🧪 开始系统测试..."
echo ""

# 检查前端build
echo "1️⃣  检查前端build状态..."
if [ -d "dist" ]; then
  echo "   ✅ dist目录存在"
  echo "   📊 Size: $(du -sh dist | cut -f1)"
else
  echo "   ❌ dist目录不存在，请先运行: npm run build"
  exit 1
fi

echo ""
echo "2️⃣  检查后端依赖..."
cd server
if [ -d "node_modules" ]; then
  echo "   ✅ 后端依赖已安装"
else
  echo "   ❌ 后端依赖未安装，正在安装..."
  npm install
fi
cd ..

echo ""
echo "3️⃣  检查数据文件..."
if [ -f "server/data/priceData.json" ]; then
  LINES=$(wc -l < server/data/priceData.json)
  echo "   ✅ 价格数据文件存在 ($LINES 行)"
else
  echo "   ❌ 价格数据文件不存在"
  exit 1
fi

echo ""
echo "4️⃣  验证API端点配置..."
if grep -q "5000" server/index.js; then
  echo "   ✅ 后端API端口: 5000"
else
  echo "   ❌ 后端端口配置有问题"
fi

echo ""
echo "5️⃣  检查前端配置..."
if grep -q "VUE_APP_API_URL" src/components/PriceTrendChartAdvanced.vue; then
  echo "   ✅ 前端API配置正确"
else
  echo "   ❌ 前端API配置有问题"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ 系统配置检查完成！"
echo ""
echo "🚀 快速开始:"
echo "   npm run dev          # 同时启动前后端"
echo ""
echo "📊 API测试 (后端启动后):"
echo "   curl http://localhost:5000/api/health"
echo "   curl http://localhost:5000/api/components"
echo ""
echo "🌐 访问应用:"
echo "   http://localhost:8080"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
