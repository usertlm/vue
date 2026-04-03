#!/bin/bash
# start-scraper.sh - 启动淘宝爬虫脚本

set -e

echo "================================"
echo "🖥️  电脑配件价格爬虫启动器"
echo "================================"
echo ""

# 检查 Python
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误: 未找到 Python 3"
    echo "   请先安装 Python 3: https://www.python.org/downloads/"
    exit 1
fi

echo "✓ Python 版本: $(python3 --version)"
echo ""

# 检查依赖
echo "检查 Python 依赖..."
pip_packages="requests beautifulsoup4 cloudscraper"

for package in $pip_packages; do
    if ! python3 -m pip show $package > /dev/null 2>&1; then
        echo "  安装 $package..."
        pip install $package --quiet
    else
        echo "  ✓ $package"
    fi
done

echo ""
echo "选择操作模式:"
echo "1) 一次性爬取 (--once)"
echo "2) 定时爬取 - 每1小时 (默认)"
echo "3) 定时爬取 - 每30分钟"
echo "4) 自定义时间间隔"
echo ""

read -p "请选择 [1-4]: " choice

case $choice in
    1)
        echo ""
        echo "运行一次性爬取..."
        python3 scripts/taobao_price_scraper.py --once
        ;;
    2)
        echo ""
        echo "启动定时爬虫 (1小时间隔)..."
        python3 scripts/taobao_price_scraper.py
        ;;
    3)
        echo ""
        echo "启动定时爬虫 (30分钟间隔)..."
        python3 scripts/taobao_price_scraper.py --interval 1800
        ;;
    4)
        read -p "输入间隔时间 (秒): " interval
        if [[ $interval =~ ^[0-9]+$ ]]; then
            echo "启动定时爬虫 (${interval}秒间隔)..."
            python3 scripts/taobao_price_scraper.py --interval $interval
        else
            echo "❌ 无效的数字"
            exit 1
        fi
        ;;
    *)
        echo "❌ 无效的选择"
        exit 1
        ;;
esac

echo ""
echo "✓ 爬虫已启动！"
echo "  数据文件: data/price-history.json"
echo "  按 Ctrl+C 停止爬虫"
echo ""
