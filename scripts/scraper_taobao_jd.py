#!/usr/bin/env python3
"""
scrape_taobao_jd.py
===================
电脑配件价格爬虫 - 淘宝/天猫 + 京东双源
使用 Playwright 真实浏览器绕过反爬

依赖安装:
  pip install playwright
  playwright install chromium --with-deps

运行:
  python scrape_taobao_jd.py              # 单次运行
  python scrape_taobao_jd.py --interval 60 # 每60分钟定时

数据输出:
  data/price-history.json (本地持久化)
  同时推送到 /api/prices (如果 API 可达)
"""

import os
import sys
import json
import time
import random
import logging
import argparse
import subprocess
from datetime import datetime, timezone
from pathlib import Path

# ── 日志配置 ──────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("price-scraper")

# ── 全局配置 ──────────────────────────────────────────────
BASE_DIR = Path(__file__).parent.parent
DATA_FILE = BASE_DIR / "data" / "price-history.json"
API_URL = os.getenv("API_URL", "http://localhost:3000")
SCRAPER_SECRET = os.getenv("SCRAPER_SECRET", "dev-secret")
HEADLESS = os.getenv("HEADLESS", "true").lower() == "true"

# ── 配件产品列表（2025-2026 热门型号）───────────────────
# 每个商品有 jd_sku（京东价格API）、tb_keyword（淘宝搜索）
PRODUCTS = {
    "cpu": [
        {"id": "cpu-1", "name": "Intel Core Ultra 9 285K", "jd_sku": "100112345678", "tb_keyword": "Intel Ultra 9 285K"},
        {"id": "cpu-2", "name": "Intel Core Ultra 7 265K", "jd_sku": "100112345679", "tb_keyword": "Intel Ultra 7 265K"},
        {"id": "cpu-3", "name": "Intel Core Ultra 5 245K", "jd_sku": "100112345680", "tb_keyword": "Intel Ultra 5 245K"},
        {"id": "cpu-4", "name": "AMD Ryzen 9 9950X", "jd_sku": "100112345681", "tb_keyword": "AMD R9 9950X"},
        {"id": "cpu-5", "name": "AMD Ryzen 9 9900X", "jd_sku": "100112345682", "tb_keyword": "AMD R9 9900X"},
        {"id": "cpu-6", "name": "AMD Ryzen 7 9700X", "jd_sku": "100112345683", "tb_keyword": "AMD R7 9700X"},
        {"id": "cpu-7", "name": "AMD Ryzen 5 9600X", "jd_sku": "100112345684", "tb_keyword": "AMD R5 9600X"},
        {"id": "cpu-8", "name": "AMD Ryzen 7 9800X3D", "jd_sku": "100112345685", "tb_keyword": "AMD R7 9800X3D 处理器"},
    ],
    "gpu": [
        {"id": "gpu-1", "name": "NVIDIA RTX 5090 D", "jd_sku": "100212345601", "tb_keyword": "RTX 5090 D 显卡"},
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


# ──────────────────────────────────────────────────────────────
#  京东价格获取（稳定接口）
# ──────────────────────────────────────────────────────────────
def fetch_jd_price(sku_id: str) -> float | None:
    """京东价格 API - 稳定可靠"""
    url = f"https://p.3.cn/prices/mgets?skuIds=J_{sku_id}"
    try:
        import urllib.request
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Referer": "https://www.jd.com/",
        })
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
        if data and isinstance(data, list) and data[0].get("p"):
            return float(data[0]["p"])
    except Exception as e:
        log.debug(f"JD price failed for {sku_id}: {e}")
    return None


# ──────────────────────────────────────────────────────────────
#  淘宝/天猫价格获取（Playwright 真实浏览器）
# ──────────────────────────────────────────────────────────────
def fetch_tb_price_with_playwright(keyword: str, browser_page) -> float | None:
    """使用 Playwright 爬取淘宝搜索页第一个商品价格"""
    search_url = f"https://s.taobao.com/search?q={keyword}&sort=sale-desc"

    try:
        # 访问搜索页
        response = browser_page.goto(search_url, wait_until="domcontentloaded", timeout=30000)
        if response and response.status >= 400:
            return None

        # 等待商品列表加载
        browser_page.wait_for_selector(".items li", timeout=15000)

        # 提取价格（淘宝页面结构）
        price_elem = browser_page.query_selector(".items li:first-child .price")
        if price_elem:
            text = price_elem.inner_text()
            # 提取数字
            import re
            numbers = re.findall(r"[\d.]+", text.replace(",", ""))
            if numbers:
                return float(numbers[0])

        # 备用：直接从页面源码解析
        html = browser_page.content()
        import re
        # 尝试匹配第一个商品价格
        price_match = re.search(r'"viewPrice":"¥([0-9.]+)"', html)
        if price_match:
            return float(price_match.group(1))

    except Exception as e:
        log.debug(f"Taobao playwright failed for '{keyword}': {e}")

    return None


def fetch_tb_price_fallback(keyword: str) -> float | None:
    """备用：使用 requests 抓取淘宝（可能失败，适合降级）"""
    import urllib.request
    import re as regex

    url = f"https://s.taobao.com/search?q={keyword}&sort=sale-desc"
    try:
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        })
        with urllib.request.urlopen(req, timeout=12) as resp:
            html = resp.read().decode("utf-8", errors="ignore")

        # 尝试从 HTML 中提取价格
        patterns = [
            r'"viewPrice":"¥([0-9.]+)"',
            r'"price":"([0-9.]+)"',
            r'data-price="([0-9.]+)"',
        ]
        for pattern in patterns:
            m = regex.search(pattern, html)
            if m:
                return float(m.group(1))
    except Exception as e:
        log.debug(f"Taobao fallback failed for '{keyword}': {e}")
    return None


# ──────────────────────────────────────────────────────────────
#  Playwright 浏览器管理器
# ──────────────────────────────────────────────────────────────
def get_playwright_browser():
    """启动 Playwright Chromium 浏览器"""
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        log.error("Playwright not installed. Run: pip install playwright && playwright install chromium")
        sys.exit(1)

    p = sync_playwright().start()
    browser = p.chromium.launch(
        headless=HEADLESS,
        args=[
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-blink-features=AutomationControlled",
            "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        ]
    )
    context = browser.new_context(
        locale="zh-CN",
        timezone_id="Asia/Shanghai",
        extra_http_headers={
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        }
    )
    page = context.new_page()
    return p, browser, page


# ──────────────────────────────────────────────────────────────
#  核心爬取逻辑
# ──────────────────────────────────────────────────────────────
def scrape_all() -> dict:
    """爬取所有配件价格，返回结果字典"""
    results = {cat: [] for cat in PRODUCTS}
    scrap_stats = {cat: {"success": 0, "failed": 0, "jd_only": 0} for cat in PRODUCTS}

    # 尝试启动 Playwright（用于淘宝）
    pw_browser = None
    pw_context = None
    try:
        _p, _browser, _page = get_playwright_browser()
        pw_browser = _browser
        pw_context = (_p, _browser, _page)
        log.info("✅ Playwright 浏览器已启动（淘宝爬虫就绪）")
    except Exception as e:
        log.warning(f"⚠️ 无法启动 Playwright 浏览器: {e}，将仅使用京东价格")
        pw_context = None

    page = pw_context[2] if pw_context else None

    try:
        for cat, items in PRODUCTS.items():
            cat_icon = {"cpu": "⚙️", "gpu": "🎮", "ram": "💾", "ssd": "💿", "mb": "🔌", "cool": "❄️"}[cat]
            log.info(f"\n{cat_icon} 正在爬取 {cat.upper()}...")

            for product in items:
                price = None
                source = "none"

                # ① 先尝试京东价格（稳定）
                jd_price = fetch_jd_price(product["jd_sku"])
                if jd_price and jd_price > 0:
                    price = jd_price
                    source = "jd"
                    log.info(f"  ✅ 京东 {product['name']}: ¥{price:.0f}")

                # ② 京东失败，尝试淘宝（Playwright）
                if price is None or price == 0:
                    tb_price = None
                    if page:
                        tb_price = fetch_tb_price_with_playwright(product["tb_keyword"], page)
                    if not tb_price:
                        tb_price = fetch_tb_price_fallback(product["tb_keyword"])

                    if tb_price and tb_price > 0:
                        price = tb_price
                        source = "taobao"
                        log.info(f"  ✅ 淘宝 {product['name']}: ¥{price:.0f}")

                # ③ 记录结果
                if price and price > 0:
                    results[cat].append({
                        "id": product["id"],
                        "name": product["name"],
                        "price": round(price, 2),
                        "source": source,
                    })
                    scrap_stats[cat]["success"] += 1
                    if source == "jd":
                        scrap_stats[cat]["jd_only"] += 1
                else:
                    results[cat].append({
                        "id": product["id"],
                        "name": product["name"],
                        "price": product.get("fallback_price", 0),
                        "source": "failed",
                    })
                    scrap_stats[cat]["failed"] += 1
                    log.warning(f"  ❌ 获取失败 {product['name']}")

                # 礼貌间隔（京东→京东之间、淘宝请求之间）
                time.sleep(random.uniform(1.0, 2.5))

    finally:
        if pw_context:
            try:
                pw_context[0].stop()  # 停止 playwright
            except Exception:
                pass

    # 打印统计
    total_success = sum(s["success"] for s in scrap_stats.values())
    total_failed = sum(s["failed"] for s in scrap_stats.values())
    log.info(f"\n📊 爬取完成: {total_success} 成功, {total_failed} 失败")

    return {"categories": results, "stats": scrap_stats}


# ──────────────────────────────────────────────────────────────
#  数据持久化
# ──────────────────────────────────────────────────────────────
def load_history() -> dict:
    """加载现有历史数据"""
    if DATA_FILE.exists():
        try:
            return json.loads(DATA_FILE.read_text("utf-8"))
        except Exception:
            pass
    return {"categories": {}, "lastUpdated": None}


def save_history(history: dict, new_prices: dict):
    """合并新价格到历史数据并保存"""
    now = datetime.now(timezone.utc).isoformat()

    if "categories" not in history:
        history["categories"] = {}

    for cat, items in new_prices.items():
        if cat not in history["categories"]:
            history["categories"][cat] = []

        for incoming in items:
            # 查找或创建本地条目
            local = next((i for i in history["categories"][cat] if i["id"] == incoming["id"]), None)

            if local is None:
                # 新增商品
                local = {
                    "id": incoming["id"],
                    "name": incoming["name"],
                    "price": incoming["price"],
                    "history": [],
                }
                history["categories"][cat].append(local)
            else:
                # 价格变化 → 写入历史记录
                if local.get("price") != incoming["price"] and incoming.get("price", 0) > 0:
                    local.setdefault("history", []).append({
                        "time": now,
                        "price": incoming["price"],
                        "source": incoming.get("source", "unknown"),
                    })
                    # 最多保留 500 条历史
                    if len(local["history"]) > 500:
                        local["history"] = local["history"][-500:]

                # 更新当前价格
                if incoming.get("price", 0) > 0:
                    local["price"] = incoming["price"]
                local["name"] = incoming["name"]

    history["lastUpdated"] = now

    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    DATA_FILE.write_text(json.dumps(history, ensure_ascii=False, indent=2), "utf-8")
    log.info(f"💾 数据已保存: {DATA_FILE}")


# ──────────────────────────────────────────────────────────────
#  API 推送（可选）
# ──────────────────────────────────────────────────────────────
def push_to_api(new_prices: dict):
    """推送新价格到 API 端点"""
    try:
        import urllib.request
        import urllib.parse

        payload = json.dumps({"categories": new_prices}).encode()
        req = urllib.request.Request(
            f"{API_URL}/api/prices",
            data=payload,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {SCRAPER_SECRET}",
            },
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            result = json.loads(resp.read().decode())
            log.info(f"✅ API 推送成功: {result}")
    except Exception as e:
        log.warning(f"⚠️ API 推送失败（不影响本地保存）: {e}")


# ──────────────────────────────────────────────────────────────
#  主流程
# ──────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="电脑配件价格爬虫（淘宝+京东）")
    parser.add_argument("--interval", type=int, default=0, help="循环间隔（分钟），0=单次运行")
    parser.add_argument("--no-push", action="store_true", help="跳过 API 推送")
    parser.add_argument("--headful", action="store_true", help="显示浏览器窗口（调试用）")
    args = parser.parse_args()

    global HEADLESS
    if args.headful:
        HEADLESS = False

    if args.interval > 0:
        log.info(f"⏰ 定时模式: 每 {args.interval} 分钟运行一次")
        while True:
            new_prices = scrape_all()["categories"]
            history = load_history()
            save_history(history, new_prices)
            if not args.no_push:
                push_to_api(new_prices)
            log.info(f"💤 等待 {args.interval} 分钟...")
            time.sleep(args.interval * 60)
    else:
        new_prices = scrape_all()["categories"]
        history = load_history()
        save_history(history, new_prices)
        if not args.no_push:
            push_to_api(new_prices)
        log.info("✅ 本轮爬取完成")


if __name__ == "__main__":
    main()
