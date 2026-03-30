#!/usr/bin/env python3
"""
Real Price Scraper
Fetches actual prices from JD.com (京东) using requests
"""

import json
import re
import urllib.parse
from datetime import datetime
import requests
from bs4 import BeautifulSoup

# Product search keywords for JD.com
PRODUCTS = {
    'gpu': {
        'name': '显卡',
        'items': [
            {'id': 'rtx4090', 'name': 'RTX 4090', 'keyword': 'RTX4090 显卡'},
            {'id': 'rtx4080', 'name': 'RTX 4080', 'keyword': 'RTX4080 显卡'},
            {'id': 'rtx4070', 'name': 'RTX 4070', 'keyword': 'RTX4070 显卡'},
            {'id': 'rx7900xtx', 'name': 'RX 7900 XTX', 'keyword': 'RX7900XTX 显卡'},
            {'id': 'rx7800xt', 'name': 'RX 7800 XT', 'keyword': 'RX7800XT 显卡'},
        ]
    },
    'cpu': {
        'name': 'CPU',
        'items': [
            {'id': 'i9-14900k', 'name': 'Intel i9-14900K', 'keyword': 'i9-14900K CPU'},
            {'id': 'i7-14700k', 'name': 'Intel i7-14700K', 'keyword': 'i7-14700K CPU'},
            {'id': 'r9-7950x', 'name': 'AMD R9 7950X', 'keyword': 'R9-7950X CPU'},
            {'id': 'r7-7800x3d', 'name': 'AMD R7 7800X3D', 'keyword': 'R7-7800X3D CPU'},
            {'id': 'i5-14600k', 'name': 'Intel i5-14600K', 'keyword': 'i5-14600K CPU'},
        ]
    },
    'ram': {
        'name': '内存',
        'items': [
            {'id': 'ddr5-32g', 'name': 'DDR5 32GB', 'keyword': 'DDR5 32GB 内存'},
            {'id': 'ddr5-64g', 'name': 'DDR5 64GB', 'keyword': 'DDR5 64GB 内存'},
            {'id': 'ddr4-32g', 'name': 'DDR4 32GB', 'keyword': 'DDR4 32GB 内存'},
        ]
    },
    'ssd': {
        'name': '固态硬盘',
        'items': [
            {'id': '990pro-2t', 'name': '三星 990 Pro 2TB', 'keyword': '三星 990 Pro 2TB SSD'},
            {'id': 'sn850x-2t', 'name': 'WD Black SN850X 2TB', 'keyword': 'WD SN850X 2TB SSD'},
            {'id': 'p7000z-2t', 'name': '致态 P7000Z 2TB', 'keyword': '致态 P7000Z 2TB'},
        ]
    },
    'monitor': {
        'name': '显示器',
        'items': [
            {'id': 'lg-27gp95r', 'name': 'LG 27GP95R', 'keyword': 'LG 27GP95R 显示器'},
            {'id': 'dell-g3223q', 'name': 'Dell G3223Q', 'keyword': 'Dell G3223Q 显示器'},
            {'id': 'samsung-odyssey', 'name': '三星 Odyssey G7', 'keyword': '三星 Odyssey G7 显示器'},
        ]
    }
}


def fetch_price_from_jd(keyword):
    """Fetch the first product price matching the keyword from JD.com"""
    try:
        url = 'https://search.jd.com/Search'
        params = {
            'keyword': keyword,
            'enc': 'utf-8'
        }
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Referer': 'https://www.jd.com/'
        }
        
        response = requests.get(url, params=params, headers=headers, timeout=10)
        response.encoding = 'utf-8'
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # JD.com price selectors
        items = soup.select('.gl-item')
        if not items:
            items = soup.select('.goods-item')
        if not items:
            items = soup.select('[class*="item"]')
        
        if items:
            first = items[0]
            
            # Get price
            price_elem = first.select_one('.p-price i')
            if not price_elem:
                price_elem = first.select_one('[class*="price"]')
            if not price_elem:
                price_elem = first.select_one('.price')
            
            # Get name
            name_elem = first.select_one('.p-name em')
            if not name_elem:
                name_elem = first.select_one('[class*="name"]')
            if not name_elem:
                name_elem = first.select_one('.name')
            
            if price_elem:
                price_text = price_elem.get_text(strip=True)
                price = re.sub(r'[^\d.]', '', price_text)
                
                if price:
                    name = name_elem.get_text(strip=True) if name_elem else keyword
                    return {
                        'name': name,
                        'price': float(price),
                        'success': True
                    }
        
        return {'error': 'No items found', 'success': False}
        
    except Exception as e:
        return {'error': str(e), 'success': False}


def main():
    print("=" * 60)
    print(f"Real Price Scraper - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    print("Source: JD.com (京东)")
    print()
    
    results = {}
    
    for category_id, category in PRODUCTS.items():
        print(f"\n[{category['name']}]")
        category_results = {}
        
        for item in category['items']:
            print(f"  {item['name']}...", end=" ", flush=True)
            price_data = fetch_price_from_jd(item['keyword'])
            
            if price_data.get('success'):
                print(f"¥{price_data['price']:.2f}")
                category_results[item['id']] = {
                    'name': price_data['name'],
                    'price': price_data['price']
                }
            else:
                print(f"Failed ({price_data.get('error', 'Unknown')})")
                category_results[item['id']] = None
        
        results[category_id] = category_results
    
    # Save to file
    import os
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    os.makedirs(data_dir, exist_ok=True)
    
    output_file = os.path.join(data_dir, 'price-history.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print(f"\nSaved to {output_file}")
    
    return results


if __name__ == '__main__':
    main()
