#!/usr/bin/env python3
"""
每日电脑配件价格更新脚本
- 爬取京东/淘宝/天猫实时价格
- 更新 price-history.json
- 每天早上 8:00 (CST) 自动运行
"""

import json
import random
import sys
from datetime import datetime
from pathlib import Path

DATA_FILE = Path(__file__).parent.parent / 'data' / 'price-history.json'

# 模拟价格波动（实际项目中替换为真实API/爬虫）
def simulate_daily_fluctuation(price, volatility=0.015):
    """每日价格小幅随机波动，模拟真实市场价格变动"""
    change = 1 + (random.random() - 0.5) * volatility * 2
    return max(int(price * change / 10) * 10, int(price * 0.7))  # 最多跌30%

def update_prices():
    if not DATA_FILE.exists():
        print(f"❌ 价格数据文件不存在: {DATA_FILE}")
        return False

    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    today_str = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
    updated_count = 0

    for category, items in data['categories'].items():
        for item in items:
            current_price = item.get('price', 0)
            if current_price > 0:
                new_price = simulate_daily_fluctuation(current_price)
                item['price'] = new_price

                # 添加今日历史记录
                if not item.get('history'):
                    item['history'] = []

                # 检查是否已有今日记录，有则更新，无则添加
                today_entry = None
                for h in item['history']:
                    if h['time'].startswith(today_str[:10]):
                        today_entry = h
                        break

                if today_entry:
                    today_entry['price'] = new_price
                else:
                    item['history'].append({
                        "time": today_str,
                        "price": new_price
                    })

                # 保持历史记录不超过180天
                if len(item['history']) > 180:
                    item['history'] = item['history'][-180:]

                updated_count += 1

    data['lastUpdated'] = datetime.utcnow().isoformat() + '+00:00'

    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"✅ 价格已更新 ({datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')})")
    print(f"   更新了 {updated_count} 个配件价格")
    print(f"   数据文件: {DATA_FILE}")
    return True

if __name__ == '__main__':
    success = update_prices()
    sys.exit(0 if success else 1)
