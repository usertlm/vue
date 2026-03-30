#!/usr/bin/env python3
"""
Real Price Scraper using Scrapling Stealth Fetcher
Uses advanced anti-bot bypass techniques to scrape prices
"""

import json
import re
import os
from datetime import datetime
from scrapling.fetchers import StealthyFetcher

# Product search keywords
PRODUCTS = {
    'gpu': {
        'name': '显卡',
        'items': [
            {'id': 'rtx4090', 'name': 'RTX 4090', 'keyword': 'RTX4090'},
            {'id': 'rtx4080', 'name': 'RTX 4080', 'keyword': 'RTX4080'},
            {'id': 'rtx4070', 'name': 'RTX 4070', 'keyword': 'RTX4070'},
            {'id': 'rx7900xtx', 'name': 'RX 7900 XTX', 'keyword': 'RX7900XTX'},
            {'id': 'rx7800xt', 'name': 'RX 7800 XT', 'keyword': 'RX7800XT'},
        ]
    },
    'cpu': {
        'name': 'CPU',
        'items': [
            {'id': 'i9-14900k', 'name': 'Intel i9-14900K', 'keyword': 'i9-14900K'},
            {'id': 'i7-14700k', 'name': 'Intel i7-14700K', 'keyword': 'i7-14700K'},
            {'id': 'r9-7950x', 'name': 'AMD R9 7950X', 'keyword': 'R9-7950X'},
            {'id': 'r7-7800x3d', 'name': 'AMD R7 7800X3D', 'keyword': 'R7-7800X3D'},
            {'id': 'i5-14600k', 'name': 'Intel i5-14600K', 'keyword': 'i5-14600K'},
        ]
    },
    'ram': {
        'name': '内存',
        'items': [
            {'id': 'ddr5-32g', 'name': 'DDR5 32GB', 'keyword': 'DDR5 32GB'},
            {'id': 'ddr5-64g', 'name': 'DDR5 64GB', 'keyword': 'DDR5 64GB'},
            {'id': 'ddr4-32g', 'name': 'DDR4 32GB', 'keyword': 'DDR4 32GB'},
        ]
    },
    'ssd': {
        'name': '固态硬盘',
        'items': [
            {'id': '990pro-2t', 'name': '三星 990 Pro 2TB', 'keyword': '990 Pro 2TB SSD'},
            {'id': 'sn850x-2t', 'name': 'WD Black SN850X 2TB', 'keyword': 'SN850X 2TB SSD'},
            {'id': 'p7000z-2t', 'name': '致态 P7000Z 2TB', 'keyword': 'P7000Z 2TB'},
        ]
    },
    'monitor': {
        'name': '显示器',
        'items': [
            {'id': 'lg-27gp95r', 'name': 'LG 27GP95R', 'keyword': 'LG 27GP95R'},
            {'id': 'dell-g3223q', 'name': 'Dell G3223Q', 'keyword': 'Dell G3223Q'},
            {'id': 'samsung-odyssey', 'name': '三星 Odyssey G7', 'keyword': 'Odyssey G7'},
        ]
    }
}


def fetch_price_from_amazon(keyword):
    """Fetch from Amazon with stealth mode"""
    try:
        fetcher = StealthyFetcher()
        # Use Amazon product search
        url = f'https://www.amazon.com/s?k={keyword.replace(" ", "+")}'
        
        print(f"    Amazon: {url}")
        page = fetcher.fetch(url, headless=True, network_idle=True, timeout=30000)
        
        # Amazon selectors
        items = page.css('[data-component-type="s-search-result"]')
        if not items:
            items = page.css('.s-result-item')
        
        if items:
            first = items[0]
            price = None
            name = None
            
            # Get price
            for sel in ['.a-price .a-offscreen::text', '[class*="price"]::text', '.a-offscreen::text']:
                elem = first.css(sel)
                if elem:
                    text = elem.get()
                    if text:
                        cleaned = re.sub(r'[^\d.]', '', text)
                        if cleaned:
                            price = float(cleaned)
                            break
            
            # Get name
            for sel in ['h2 a span::text', '[class*="title"]::text', 'a span::text']:
                elem = first.css(sel)
                if elem:
                    text = elem.get()
                    if text and len(text) > 5:
                        name = text.strip()
                        break
            
            if price:
                return {'name': name or keyword, 'price': price, 'success': True}
        
        return {'error': 'No items found', 'success': False}
    except Exception as e:
        return {'error': str(e), 'success': False}


def fetch_price_from_generic(keyword):
    """Generic fallback using 1688 or other sources"""
    try:
        fetcher = Fetcher()
        # Try 1688
        url = f'https://s.1688.com/joffer/search/search.json?keywords={keyword}'
        page = fetcher.fetch(url)
        
        # Parse JSON-like response
        text = page.content
        # Try to find price patterns
        prices = re.findall(r'¥(\d+\.?\d*)', text)
        if prices:
            return {'name': keyword, 'price': float(prices[0]), 'success': True}
        
        return {'error': 'No price found', 'success': False}
    except Exception as e:
        return {'error': str(e), 'success': False}


def main():
    print("=" * 60)
    print(f"Real Price Scraper - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    print("Trying Amazon first, then alternatives...")
    print()
    
    results = {}
    
    for category_id, category in PRODUCTS.items():
        print(f"\n[{category['name']}]")
        category_results = {}
        
        for item in category['items']:
            print(f"  {item['name']}...", end=" ", flush=True)
            price_data = fetch_price_from_amazon(item['keyword'])
            
            if price_data.get('success'):
                print(f"${price_data['price']:.2f} ({price_data['name'][:30]}...)")
                category_results[item['id']] = {
                    'name': price_data['name'],
                    'price': price_data['price'],
                    'currency': 'USD'
                }
            else:
                print(f"Failed - {price_data.get('error', 'Unknown')}")
                category_results[item['id']] = None
        
        results[category_id] = category_results
    
    # Save to file
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    os.makedirs(data_dir, exist_ok=True)
    
    output_file = os.path.join(data_dir, 'price-history.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print(f"\nSaved to {output_file}")
    return results


if __name__ == '__main__':
    main()
