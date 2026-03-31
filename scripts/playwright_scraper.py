#!/usr/bin/env python3
"""
Playwright Scraper for JD.com and Taobao
Uses headless browser to bypass anti-bot protection
"""

import os
import json
import re
import time
import random
from datetime import datetime
from pathlib import Path
from playwright.sync_api import sync_playwright

# ── 配置 ────────────────────────────────────────────────────
DATA_FILE = Path(__file__).parent.parent / "data" / "price-history.json"
SCRAPER_SECRET = os.getenv("SCRAPER_SECRET", "dev-secret")

# ── 商品列表（2025-2026 最新型号）───────────────────────────
PRODUCTS = {
 "cpu": [
 {"id": "cpu-1", "name": "Intel Core Ultra 9 285K", "jd_keyword": "Intel Core Ultra 9 285K", "tb_keyword": "Intel Core Ultra 9 285K"},
 {"id": "cpu-2", "name": "Intel Core Ultra 7 265K", "jd_keyword": "Intel Core Ultra 7 265K", "tb_keyword": "Intel Core Ultra 7 265K"},
 {"id": "cpu-3", "name": "Intel Core Ultra 5 245K", "jd_keyword": "Intel Core Ultra 5 245K", "tb_keyword": "Intel Core Ultra 5 245K"},
 {"id": "cpu-4", "name": "AMD Ryzen 9 9950X", "jd_keyword": "AMD Ryzen 9 9950X", "tb_keyword": "AMD Ryzen 9 9950X"},
 {"id": "cpu-5", "name": "AMD Ryzen 9 9900X", "jd_keyword": "AMD Ryzen 9 9900X", "tb_keyword": "AMD Ryzen 9 9900X"},
 {"id": "cpu-6", "name": "AMD Ryzen 7 9700X", "jd_keyword": "AMD Ryzen 7 9700X", "tb_keyword": "AMD Ryzen 7 9700X"},
 {"id": "cpu-7", "name": "AMD Ryzen 5 9600X", "jd_keyword": "AMD Ryzen 5 9600X", "tb_keyword": "AMD Ryzen 5 9600X"},
 {"id": "cpu-8", "name": "AMD Ryzen 7 9800X3D", "jd_keyword": "AMD Ryzen 7 9800X3D", "tb_keyword": "AMD Ryzen 7 9800X3D"},
 ],
 "gpu": [
 {"id": "gpu-1", "name": "NVIDIA RTX 5090", "jd_keyword": "RTX 5090", "tb_keyword": "RTX 5090 显卡"},
 {"id": "gpu-2", "name": "NVIDIA RTX 5080", "jd_keyword": "RTX 5080", "tb_keyword": "RTX 5080 显卡"},
 {"id": "gpu-3", "name": "NVIDIA RTX 5070 Ti", "jd_keyword": "RTX 5070 Ti", "tb_keyword": "RTX 5070 Ti 显卡"},
 {"id": "gpu-4", "name": "NVIDIA RTX 5070", "jd_keyword": "RTX 5070", "tb_keyword": "RTX 5070 显卡"},
 {"id": "gpu-5", "name": "AMD RX 9070 XT", "jd_keyword": "RX 9070 XT", "tb_keyword": "RX 9070 XT 显卡"},
 {"id": "gpu-6", "name": "AMD RX 9070", "jd_keyword": "RX 9070", "tb_keyword": "RX 9070 显卡"},
 {"id": "gpu-7", "name": "NVIDIA RTX 4090 D", "jd_keyword": "RTX 4090 D", "tb_keyword": "RTX 4090 D 显卡"},
 {"id": "gpu-8", "name": "AMD RX 7900 XTX", "jd_keyword": "RX 7900 XTX", "tb_keyword": "RX 7900 XTX 显卡"},
 ],
 "ram": [
 {"id": "ram-1", "name": "DDR5 32GB (2x16GB) 6000MHz", "jd_keyword": "DDR5 32GB 6000MHz", "tb_keyword": "DDR5 32GB 6000MHz 内存"},
 {"id": "ram-2", "name": "DDR5 64GB (2x32GB) 6000MHz", "jd_keyword": "DDR5 64GB 6000MHz", "tb_keyword": "DDR5 64GB 6000MHz 内存"},
 {"id": "ram-3", "name": "DDR5 128GB (4x32GB) 6000MHz", "jd_keyword": "DDR5 128GB 6000MHz", "tb_keyword": "DDR5 128GB 内存"},
 {"id": "ram-4", "name": "DDR4 32GB (2x16GB) 3200MHz", "jd_keyword": "DDR4 32GB 3200MHz", "tb_keyword": "DDR4 32GB 3200MHz 内存"},
 {"id": "ram-5", "name": "DDR5 96GB (2x48GB) 6400MHz", "jd_keyword": "DDR5 96GB 6400MHz", "tb_keyword": "DDR5 96GB 6400MHz 内存"},
 ],
 "ssd": [
 {"id": "ssd-1", "name": "三星 990 Pro 2TB", "jd_keyword": "三星 990 Pro 2TB", "tb_keyword": "三星 990 Pro 2TB 固态"},
 {"id": "ssd-2", "name": "三星 990 Pro 4TB", "jd_keyword": "三星 990 Pro 4TB", "tb_keyword": "三星 990 Pro 4TB 固态"},
 {"id": "ssd-3", "name": "WD Black SN850X 2TB", "jd_keyword": "WD SN850X 2TB", "tb_keyword": "WD SN850X 2TB 固态"},
 {"id": "ssd-4", "name": "致态 TiPlus7100 2TB", "jd_keyword": "致态 TiPlus7100 2TB", "tb_keyword": "致态 TiPlus7100 2TB"},
 {"id": "ssd-5", "name": "海力士 P41 2TB", "jd_keyword": "海力士 P41 2TB", "tb_keyword": "海力士 P41 2TB 固态"},
 {"id": "ssd-6", "name": "三星 9100 Pro 2TB", "jd_keyword": "三星 9100 Pro 2TB", "tb_keyword": "三星 9100 Pro 2TB"},
 ],
 "mb": [
 {"id": "mb-1", "name": "ROG MAXIMUS Z890 APEX", "jd_keyword": "ROG MAXIMUS Z890 APEX", "tb_keyword": "ROG MAXIMUS Z890 APEX"},
 {"id": "mb-2", "name": "ROG STRIX Z890-E", "jd_keyword": "ROG STRIX Z890-E", "tb_keyword": "ROG STRIX Z890-E"},
 {"id": "mb-3", "name": "MSI MEG Z890 ACE", "jd_keyword": "MSI MEG Z890 ACE", "tb_keyword": "MSI MEG Z890 ACE"},
 {"id": "mb-4", "name": "ROG CROSSHAIR X870E HERO", "jd_keyword": "ROG CROSSHAIR X870E HERO", "tb_keyword": "ROG CROSSHAIR X870E HERO"},
 {"id": "mb-5", "name": "MSI MAG X870 TOMAHAWK", "jd_keyword": "MSI MAG X870 TOMAHAWK", "tb_keyword": "MSI MAG X870 TOMAHAWK"},
 {"id": "mb-6", "name": "华硕 B850M-K", "jd_keyword": "华硕 B850M-K", "tb_keyword": "华硕 B850M-K 主板"},
 ],
 "cool": [
 {"id": "cool-1", "name": "猫头鹰 NH-D15", "jd_keyword": "猫头鹰 NH-D15", "tb_keyword": "猫头鹰 NH-D15 散热器"},
 {"id": "cool-2", "name": "猫头鹰 NH-U12A", "jd_keyword": "猫头鹰 NH-U12A", "tb_keyword": "猫头鹰 NH-U12A 散热器"},
 {"id": "cool-3", "name": "利民 FC140", "jd_keyword": "利民 FC140", "tb_keyword": "利民 FC140 散热器"},
 {"id": "cool-4", "name": "海盗船 H150i Elite", "jd_keyword": "海盗船 H150i Elite", "tb_keyword": "海盗船 H150i Elite"},
 {"id": "cool-5", "name": "华硕 龙神3代 360", "jd_keyword": "华硕 龙神3代 360", "tb_keyword": "华硕 龙神3代 360 水冷"},
 ],
}


def fetch_jd_price(keyword, page):
 """使用 Playwright 从京东获取价格"""
 try:
 url = f"https://search.jd.com/Search?keyword={keyword}&enc=utf-8"
 page.goto(url, wait_until="networkidle", timeout=30000)
 
 # 等待商品列表加载
 page.wait_for_selector(".gl-item", timeout=10000)
 
 # 获取第一个商品的价格
 price_elem = page.query_selector(".gl-item .p-price i")
 if price_elem:
 price_text = price_elem.inner_text()
 price = re.sub(r'[^\d.]', '', price_text)
 if price:
 return float(price)
 
 # 备选方案：尝试其他选择器
 for sel in [".p-price .J_{}::text", "[class*='price']::text", ".price::text"]:
 try:
 elem = page.query_selector(f".gl-item {sel}")
 if elem:
 text = elem.inner_text()
 price = re.sub(r'[^\d.]', '', text)
 if price:
 return float(price)
 except:
 pass
 
 return None
 except Exception as e:
 print(f"  ⚠️ 京东获取失败 {keyword}: {e}")
 return None


def fetch_tb_price(keyword, page):
 """使用 Playwright 从淘宝获取价格"""
 try:
 url = f"https://s.taobao.com/search?q={keyword}"
 page.goto(url, wait_until="networkidle", timeout=30000)
 
 # 等待商品列表
 page.wait_for_selector(".item", timeout=10000)
 
 # 获取价格
 price_elem = page.query_selector(".item .price")
 if price_elem:
 price_text = price_elem.inner_text()
 price = re.sub(r'[^\d.]', '', price_text)
 if price:
 return float(price)
 
 return None
 except Exception as e:
 print(f"  ⚠️ 淘宝获取失败 {keyword}: {e}")
 return None


def get_best_price(product, page):
 """从多个来源获取最佳价格"""
 # 先尝试京东
 price = fetch_jd_price(product["jd_keyword"], page)
 if price and price > 0:
 print(f"  ✅ 京东 {product['name']}: ¥{price:.0f}")
 return price, "jd"
 
 time.sleep(random.uniform(1, 2))
 
 # 尝试淘宝
 price = fetch_tb_price(product["tb_keyword"], page)
 if price and price > 0:
 print(f"  ✅ 淘宝 {product['name']}: ¥{price:.0f}")
 return price, "tb"
 
 return None, None


def main():
 print("=" * 60)
 print(f"🚀 Playwright 价格爬虫 - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
 print("=" * 60)
 
 results = {"categories": {}}
 
 with sync_playwright() as p:
 # 启动浏览器
 browser = p.chromium.launch(headless=True)
 context = browser.new_context(
 user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
 )
 page = context.new_page()
 
 for category, items in PRODUCTS.items():
 print(f"\n📦 分类: {category.upper()}")
 results["categories"][category] = []
 
 for product in items:
 print(f"  搜索 {product['name']}...", end=" ", flush=True)
 
 price, source = get_best_price(product, page)
 
 if price:
 results["categories"][category].append({
 "id": product["id"],
 "name": product["name"],
 "price": round(price, 2),
 "source": source
 })
 else:
 # 使用默认价格
 results["categories"][category].append({
 "id": product["id"],
 "name": product["name"],
 "price": 0,
 "source": "failed"
 })
 
 time.sleep(random.uniform(2, 4))
 
 browser.close()
 
 # 保存结果
 save_results(results)
 
 print("\n✅ 爬取完成！")
 return results


def save_results(results):
 """保存结果到文件"""
 DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
 
 # 读取现有数据
 existing = {}
 if DATA_FILE.exists():
 try:
 existing = json.loads(DATA_FILE.read_text("utf-8"))
 except:
 existing = {}
 
 now = datetime.now().isoformat() + "Z"
 
 if "categories" not in existing:
 existing["categories"] = {}
 
 for cat, items in results["categories"].items():
 if cat not in existing["categories"]:
 existing["categories"][cat] = []
 
 for incoming in items:
 # 查找现有商品
 local = next((i for i in existing["categories"][cat] if i["id"] == incoming["id"]), None)
 
 if not local:
 # 新商品
 existing["categories"][cat].append({
 "id": incoming["id"],
 "name": incoming["name"],
 "price": incoming["price"],
 "history": []
 })
 local = existing["categories"][cat][-1]
 
 # 更新价格并记录历史
 if incoming["price"] > 0 and local.get("price") != incoming["price"]:
 local.setdefault("history", []).append({
 "time": now,
 "price": incoming["price"],
 "source": incoming["source"]
 })
 # 保留最近 500 条
 if len(local["history"]) > 500:
 local["history"] = local["history"][-500:]
 
 local["price"] = incoming["price"]
 
 existing["lastUpdated"] = now
 
 DATA_FILE.write_text(json.dumps(existing, ensure_ascii=False, indent=2), "utf-8")
 print(f"\n💾 数据已保存到 {DATA_FILE}")


if __name__ == "__main__":
 main()
