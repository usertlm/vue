#!/usr/bin/env bash
# run-scraper.sh — 爬虫快捷启动脚本
# 用法:
#   ./run-scraper.sh           # 单次运行
#   ./run-scraper.sh --interval 60  # 每60分钟循环
#   ./run-scraper.sh --headful      # 显示浏览器窗口

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 默认参数
INTERVAL=""
HEADFUL_FLAG=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --interval)
      INTERVAL="--interval $2"
      shift 2
      ;;
    --headful)
      HEADFUL_FLAG="--headful"
      shift
      ;;
    *)
      echo "未知参数: $1"
      exit 1
      ;;
  esac
done

set -e

echo "🚀 启动价格爬虫..."
echo "   数据目录: $SCRIPT_DIR/../data/"
echo "   Python: $(python3 --version)"
echo ""

python3 "$SCRIPT_DIR/scraper_taobao_jd.py" $INTERVAL $HEADFUL_FLAG
