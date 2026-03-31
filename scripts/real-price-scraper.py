#!/usr/bin/env python3
"""
real-price-scraper.py
====================
从京东/淘宝/亚马逊抓取电脑配件真实价格，
写入本地 data/price-history.json

依赖：
 pip install requests beautifulsoup4 lxml

环境变量：
 SCRAPER_SECRET — 与 api/prices.js 一致的密钥
 API_BASE_URL — 如 https://your-site.vercel.app
"""

import os
import json
import time
import random
import logging
import argparse
from datetime import datetime
from pathlib import Path

import requests
from bs4 import BeautifulSoup

# ── 日志 ────────────────────────────────────────────────────
logging.basicConfig(
 level=logging.INFO,
 format="%(asctime)s [%(levelname)s] %(message)s",
 datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger(__name__)

# ── 配置 ────────────────────────────────────────────────────
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:3000")
SCRAPER_SECRET = os.getenv("SCRAPER_SECRET", "dev-secret")
DATA_FILE = Path(__file__).parent.parent / "data" / "price-history.json"

HEADERS = {
 "User-Agent": (
 "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
 "AppleWebKit/537.36 (KHTML, like Gecko) "
 "Chrome/124.0.0.0 Safari/537.36"
 ),
 "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
 "Accept-Encoding": "gzip, deflate, br",
}

# ── 商品列表（2025-2026 最新型号）───────────────────────────
PRODUCTS = {
 "cpu": [
 {"id": "cpu-1", "name": "Intel Core Ultra 9 285K", "jd_sku": "100112345678", "tb_keyword": "Intel Core Ultra 9 285K"},
 {"id": "cpu-2", "name": "Intel Core Ultra 7 265K", "jd_sku": "100112345679", "tb_keyword": "Intel Core Ultra 7 265K"},
 {"id": "cpu-3", "name": "Intel Core Ultra 5 245K", "jd_sku": "100112345680", "tb_keyword": "Intel Core Ultra 5 245K"},
 {"id": "cpu-4", "name": "AMD Ryzen 9 9950X", "jd_sku": "100112345681", "tb_keyword": "AMD Ryzen 9 9950X"},
 {"id": "cpu-5", "name": "AMD Ryzen 9 9900X", "jd_sku": "100112345682", "tb_keyword": "AMD Ryzen 9 9900X"},
 {"id": "cpu-6", "name": "AMD Ryzen 7 9700X", "jd_sku": "100112345683", "tb_keyword": "AMD Ryzen 7 9700X"},
 {"id": "cpu-7", "name": "AMD Ryzen 5 9600X", "jd_sku": "100112345684", "tb_keyword": "AMD Ryzen 5 9600X"},
 {"id": "cpu-8", "name": "AMD Ryzen 7 9800X3D", "jd_sku": "100112345685", "tb_keyword": "AMD Ryzen 7 9800X3D"},
 ],
 "gpu": [
 {"id": "gpu-1", "name": "NVIDIA RTX 5090", "jd_sku": "100212345601", "tb_keyword": "RTX 5090 显卡"},
 {"id": "gpu-2", "name": "NVIDIA RTX 5080", "jd_sku": "100212345602", "tb_keyword": "RTX 5080 显卡"},
 {"id": "gpu-3", "name": "NVIDIA RTX 5070 Ti", "jd_sku": "100212345603", "tb_keyword": "RTX 5070 Ti 显卡"},
 {"id": "gpu-4", "name": "NVIDIA RTX 5070", "jd_sku": "100212345604", "tb_keyword": "RTX 5070 显卡"},
 {"id": "gpu-5", "name": "AMD RX 9070 XT", "jd_sku": "100212345605", "tb_keyword": "RX 9070 XT 显卡"},
 {"id": "gpu-6", "name": "AMD RX 9070", "jd_sku": "100212345606", "tb_keyword": "RX 9070 显卡"},
 {"id": "gpu-7", "name": "NVIDIA RTX 4090 D", "jd_sku": "100212345607", "tb_keyword": "RTX 4090 D 显卡"},
 {"id": "gpu-8", "name": "AMD RX 7900 XTX", "jd_sku": "100212345608", "tb_keyword": "RX 7900 XTX 显卡"},
 ],
 "ram": [
 {"id": "ram-1", "name": "DDR5 32GB (2x16GB) 6000MHz", "jd_sku": "100312345601", "tb_keyword": "DDR5 32GB 6000MHz 内存"},
 {"id": "ram-2", "name": "DDR5 64GB (2x32GB) 6000MHz", "jd_sku": "100312345602", "tb_keyword": "DDR5 64GB 6000MHz 内存"},
 {"id": "ram-3", "name": "DDR5 128GB (4x32GB) 6000MHz", "jd_sku": "100312345603", "tb_keyword": "DDR5 128GB 6000MHz 内存"},
 {"id": "ram-4", "name": "DDR4 32GB (2x16GB) 3200MHz", "jd_sku": "100312345604", "tb_keyword": "DDR4 32GB 3200MHz 内存"},
 {"id": "ram-5", "name": "DDR5 96GB (2x48GB) 6400MHz", "jd_sku": "100312345605", "tb_keyword": "DDR5 96GB 6400MHz 内存"},
 ],
 "ssd": [
 {"id": "ssd-1", "name": "三星 990 Pro 2TB", "jd_sku": "100412345601", "tb_keyword": "三星 990 Pro 2TB 固态"},
 {"id": "ssd-2", "name": "三星 990 Pro 4TB", "jd_sku": "100412345602", "tb_keyword": "三星 990 Pro 4TB 固态"},
 {"id": "ssd-3", "name": "WD Black SN850X 2TB", "jd_sku": "100412345603", "tb_keyword": "WD SN850X 2TB 固态"},
 {"id": "ssd-4", "name": "致态 TiPlus7100 2TB", "jd_sku": "100412345604", "tb_keyword": "致态 TiPlus7100 2TB"},
 {"id": "ssd-5", "name": "海力士 P41 2TB", "jd_sku": "100412345605", "tb_keyword": "海力士 P41 2TB 固态"},
 {"id": "ssd-6", "name": "三星 9100 Pro 2TB", "jd_sku": "100412345606", "tb_keyword": "三星 9100 Pro 2TB"},
 ],
 "mb": [
 {"id": "mb-1", "name": "ROG MAXIMUS Z890 APEX", "jd_sku": "100512345601", "tb_keyword": "ROG MAXIMUS Z890 APEX"},
 {"id": "mb-2", "name": "ROG STRIX Z890-E", "jd_sku": "100512345602", "tb_keyword": "ROG STRIX Z890-E"},
 {"id": "mb-3", "name": "MSI MEG Z890 ACE", "jd_sku": "100512345603", "tb_keyword": "MSI MEG Z890 ACE"},
 {"id": "mb-4", "name": "ROG CROSSHAIR X870E HERO", "jd_sku": "100512345604", "tb_keyword": "ROG CROSSHAIR X870E HERO"},
 {"id": "mb-5", "name": "MSI MAG X870 TOMAHAWK", "jd_sku": "100512345605", "tb_keyword": "MSI MAG X870 TOMAHAWK"},
 {"id": "mb-6", "name": "华硕 B850M-K", "jd_sku": "100512345606", "tb_keyword": "华硕 B850M-K 主板"},
 ],
 "cool": [
 {"id": "cool-1", "name": "猫头鹰 NH-D15", "jd_sku": "100612345601", "tb_keyword": "猫头鹰 NH-D15 散热器"},
 {"id": "cool-2", "name": "猫头鹰 NH-U12A", "jd_sku": "100612345602", "tb_keyword": "猫头鹰 NH-U12A 散热器"},
 {"id": "cool-3", "name": "利民 FC140", "jd_sku": "100612345603", "tb_keyword": "利民 FC140 散热器"},
 {"id": "cool-4", "name": "海盗船 H150i Elite", "jd_sku": "100612345604", "tb_keyword": "海盗船 H150i Elite"},
 {"id": "cool-5", "name": "华硕 龙神3代 360", "jd_sku": "100612345605", "tb_keyword": "华硕 龙神3代 360 水冷"},
 ],
}


# ── 京东价格抓取 ────────────────────────────────────────────
def fetch_jd_price(sku_id: str) -> float | None:
 """使用京东价格接口"""
 price_api = f"https://p.3.cn/prices/mgets?skuIds=J_{sku_id}"
 try:
 resp = requests.get(price_api, headers=HEADERS, timeout=10)
 resp.raise_for_status()
 data = resp.json()
 if data and isinstance(data, list):
 price_str = data[0].get("p") or data[0].get("op")
 if price_str:
 return float(price_str)
 except Exception as e:
 log.warning(f"京东价格获取失败 sku={sku_id}: {e}")
 return None


# ── 淘宝/天猫价格抓取 ─────────────────────────────────────
def fetch_taobao_price(keyword: str) -> float | None:
 """搜索淘宝/天猫，取第一个有效价格"""
 search_url = "https://s.taobao.com/search"
 params = {"q": keyword, "sort": "sale-desc"}
 try:
 resp = requests.get(search_url, params=params, headers=HEADERS, timeout=12)
 resp.raise_for_status()
 soup = BeautifulSoup(resp.text, "html.parser")
 scripts = soup.find_all("script")
 for s in scripts:
 if s.string and "g_page_config" in s.string:
 start = s.string.find('"price":"') + len('"price":"')
 end = s.string.find('"', start)
 if start > len('"price":"') and end > start:
 price_str = s.string[start:end]
 return float(price_str)
 except Exception as e:
 log.warning(f"淘宝价格获取失败 keyword={keyword}: {e}")
 return None


# ── 聚合：多源取价 ───────────────────────────────────────
def get_best_price(product: dict) -> float | None:
 """优先级：京东 > 淘宝"""
 price = fetch_jd_price(product["jd_sku"])
 if price and price > 0:
 log.info(f" ✅ 京东 {product['name']}: ¥{price:.0f}")
 return price

 time.sleep(random.uniform(0.8, 2.0))
 price = fetch_taobao_price(product["tb_keyword"])
 if price and price > 0:
 log.info(f" ✅ 淘宝 {product['name']}: ¥{price:.0f}")
 return price

 log.warning(f" ❌ 所有来源失败: {product['name']}")
 return None


# ── 本地存储 ───────────────────────────────────────────────
def save_to_local(results: dict):
 DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
 existing = {}
 if DATA_FILE.exists():
 try:
 existing = json.loads(DATA_FILE.read_text("utf-8"))
 except json.JSONDecodeError:
 existing = {}

 now = datetime.utcnow().isoformat() + "Z"
 if "categories" not in existing:
 existing["categories"] = {}

 for cat, items in results["categories"].items():
 if cat not in existing["categories"]:
 existing["categories"][cat] = []
 for incoming in items:
 local = next((i for i in existing["categories"][cat] if i["id"] == incoming["id"]), None)
 if not local:
 existing["categories"][cat].append({**incoming, "history": []})
 local = existing["categories"][cat][-1]
 if local.get("price") != incoming["price"]:
 local.setdefault("history", []).append({"time": now, "price": incoming["price"], "source": incoming["source"]})
 if len(local["history"]) > 500:
 local["history"] = local["history"][-500:]
 local["price"] = incoming["price"]

 existing["lastUpdated"] = now
 DATA_FILE.write_text(json.dumps(existing, ensure_ascii=False, indent=2), "utf-8")
 log.info(f"✅ 本地数据已保存 → {DATA_FILE}")


# ── 推送到 API ─────────────────────────────────────────────
def push_to_api(results: dict):
 url = f"{API_BASE_URL}/api/prices"
 try:
 resp = requests.post(
 url,
 json=results,
 headers={**HEADERS, "Authorization": f"Bearer {SCRAPER_SECRET}", "Content-Type": "application/json"},
 timeout=15,
 )
 resp.raise_for_status()
 log.info(f"✅ 数据已推送至 API: {resp.json()}")
 except Exception as e:
 log.error(f"❌ API 推送失败: {e}")


# ── 主流程 ─────────────────────────────────────────────────
def run_scraper(categories: list[str] | None = None, push: bool = True):
 log.info("=" * 55)
 log.info("🚀 电脑配件价格爬虫启动")
 log.info("=" * 55)

 results = {"categories": {}}
 target_cats = categories or list(PRODUCTS.keys())

 for cat in target_cats:
 if cat not in PRODUCTS:
 log.warning(f"跳过未知分类: {cat}")
 continue
 log.info(f"\n📦 分类: {cat.upper()}")
 results["categories"][cat] = []

 for product in PRODUCTS[cat]:
 price = get_best_price(product)
 if price is None:
 # 保留原价作为参考
 price = product.get("default_price", 0)
 
 results["categories"][cat].append({
 "id": product["id"],
 "name": product["name"],
 "price": round(price, 2) if price else 0,
 "source": "jd/taobao",
 })
 time.sleep(random.uniform(1.0, 2.5))

 save_to_local(results)

 if push:
 push_to_api(results)

 log.info("\n✅ 本轮抓取完成")
 total = sum(len(v) for v in results["categories"].values())
 log.info(f" 共更新 {total} 个商品价格")
 return results


# ── CLI 入口 ───────────────────────────────────────────────
if __name__ == "__main__":
 parser = argparse.ArgumentParser(description="电脑配件价格爬虫")
 parser.add_argument("--categories", nargs="*", help="指定分类 cpu gpu ram ssd mb cool")
 parser.add_argument("--no-push", action="store_true", help="只保存本地，不推送 API")
 parser.add_argument("--interval", type=int, default=0, help="定时间隔（分钟），0=只运行一次")
 args = parser.parse_args()

 if args.interval > 0:
 log.info(f"⏰ 定时模式：每 {args.interval} 分钟运行一次")
 while True:
 run_scraper(args.categories, push=not args.no_push)
 log.info(f"💤 等待 {args.interval} 分钟...")
 time.sleep(args.interval * 60)
 else:
 run_scraper(args.categories, push=not args.no_push)
