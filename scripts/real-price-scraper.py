#!/usr/bin/env python3
"""
real-price-scraper.py
====================
从 京东 / 淘宝 / IT之家 抓取电脑配件真实价格，
写入本地 data/price-history.json，
并 POST 到 /api/prices 接口。

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

# ── 商品列表（id 与前端保持一致）───────────────────────────
PRODUCTS = {
 "cpu": [
 {"id": "cpu-1", "name": "Intel i9-14900K", "jd_sku": "100053862915", "tb_keyword": "Intel i9-14900K 处理器"},
 {"id": "cpu-2", "name": "AMD Ryzen 9 7950X", "jd_sku": "100044481979", "tb_keyword": "AMD Ryzen 9 7950X"},
 {"id": "cpu-3", "name": "Intel i5-14600K", "jd_sku": "100053862892", "tb_keyword": "Intel i5-14600K"},
 {"id": "cpu-4", "name": "AMD Ryzen 5 7600X", "jd_sku": "100044481980", "tb_keyword": "AMD Ryzen 5 7600X"},
 ],
 "gpu": [
 {"id": "gpu-1", "name": "RTX 4090", "jd_sku": "100044481977", "tb_keyword": "RTX 4090 显卡"},
 {"id": "gpu-2", "name": "RX 7900 XTX","jd_sku": "100053112756", "tb_keyword": "RX 7900 XTX 显卡"},
 {"id": "gpu-3", "name": "RTX 4070 Ti","jd_sku": "100053112757", "tb_keyword": "RTX 4070 Ti 显卡"},
 {"id": "gpu-4", "name": "RTX 4060", "jd_sku": "100053112758", "tb_keyword": "RTX 4060 8G 显卡"},
 ],
 "ram": [
 {"id": "ram-1", "name": "芝奇 DDR5 32G", "jd_sku": "100029823456", "tb_keyword": "芝奇 DDR5 32G 内存"},
 {"id": "ram-2", "name": "海力士 DDR5 16G", "jd_sku": "100029823457", "tb_keyword": "海力士 DDR5 16G"},
 {"id": "ram-3", "name": "金士顿 DDR4 32G", "jd_sku": "100029823458", "tb_keyword": "金士顿 DDR4 32G"},
 ],
 "ssd": [
 {"id": "ssd-1", "name": "三星 990 Pro 2T", "jd_sku": "100041975348", "tb_keyword": "三星 990 Pro 2T 固态"},
 {"id": "ssd-2", "name": "西数 SN850X 1T", "jd_sku": "100041975349", "tb_keyword": "西数 SN850X 1T"},
 {"id": "ssd-3", "name": "致态 TiPlus7100 2T", "jd_sku": "100041975350", "tb_keyword": "致态 TiPlus7100 2T"},
 ],
 "mb": [
 {"id": "mb-1", "name": "ROG Z790 APEX", "jd_sku": "100033892345", "tb_keyword": "ROG Z790 APEX 主板"},
 {"id": "mb-2", "name": "微星 MAG X670E", "jd_sku": "100033892346", "tb_keyword": "微星 MAG X670E 主板"},
 {"id": "mb-3", "name": "华硕 B660M-K", "jd_sku": "100033892347", "tb_keyword": "华硕 B660M-K 主板"},
 ],
 "cool": [
 {"id": "cool-1", "name": "猫头鹰 NH-D15", "jd_sku": "100018234567", "tb_keyword": "猫头鹰 NH-D15 散热"},
 {"id": "cool-2", "name": "海盗船 H150i Elite", "jd_sku": "100018234568", "tb_keyword": "海盗船 H150i Elite"},
 {"id": "cool-3", "name": "利民 FC140", "jd_sku": "100018234569", "tb_keyword": "利民 FC140 散热"},
 ],
}


# ── 京东价格抓取 ────────────────────────────────────────────
def fetch_jd_price(sku_id: str) -> float | None:
 """
 使用京东价格接口（app 端 JSON API，相对稳定）。
 注意：京东反爬较强，生产环境建议配合代理池或 playwright。
 """
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


# ── 淘宝/天猫价格抓取（搜索结果首条）────────────────────
def fetch_taobao_price(keyword: str) -> float | None:
 """
 搜索淘宝/天猫，取第一个有效价格。
 淘宝反爬极强，此处使用静态请求；生产环境需 playwright + 滑块验证码处理。
 """
 search_url = "https://s.taobao.com/search"
 params = {"q": keyword, "sort": "sale-desc"}
 try:
 resp = requests.get(search_url, params=params, headers=HEADERS, timeout=12)
 resp.raise_for_status()
 soup = BeautifulSoup(resp.text, "html.parser")
 # 尝试解析页面内嵌 JSON
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


# ── IT之家行情（备用数据源）────────────────────────────────
def fetch_ithome_price(keyword: str) -> float | None:
 """从 IT之家行情页面抓取参考价格（补充数据源）"""
 url = f"https://www.ithome.com/search/?q={requests.utils.quote(keyword)}&type=1"
 try:
 resp = requests.get(url, headers=HEADERS, timeout=10)
 soup = BeautifulSoup(resp.text, "html.parser")
 price_tag = soup.select_one(".price, .p-price, [class*='price']")
 if price_tag:
 raw = price_tag.get_text(strip=True).replace("¥", "").replace(",", "")
 import re
 m = re.search(r"\d+(\.\d+)?", raw)
 if m:
 return float(m.group())
 except Exception as e:
 log.warning(f"IT之家价格获取失败 keyword={keyword}: {e}")
 return None


# ── 聚合：多源取价，失败降级 ──────────────────────────────
def get_best_price(product: dict) -> float | None:
 """
 优先级：京东 > 淘宝 > IT之家 > 失败
 """
 price = fetch_jd_price(product["jd_sku"])
 if price and price > 0:
 log.info(f" ✅ 京东 {product['name']}: ¥{price:.0f}")
 return price

 time.sleep(random.uniform(0.8, 2.0)) # 防频控
 price = fetch_taobao_price(product["tb_keyword"])
 if price and price > 0:
 log.info(f" ✅ 淘宝 {product['name']}: ¥{price:.0f}")
 return price

 time.sleep(random.uniform(0.5, 1.2))
 price = fetch_ithome_price(product["tb_keyword"])
 if price and price > 0:
 log.info(f" ✅ IT之家 {product['name']}: ¥{price:.0f}")
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
 continue
 results["categories"][cat].append({
 "id": product["id"],
 "name": product["name"],
 "price": round(price, 2),
 "source": "jd/taobao",
 })
 time.sleep(random.uniform(1.0, 2.5)) # 请求间隔，避免封 IP

 # 保存本地
 save_to_local(results)

 # 推送 API
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
